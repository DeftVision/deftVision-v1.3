const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3')
const documentModel = require('../models/documentModel');
/*const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })*/

exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({})
        if(!documents) {
            return res.status(400).send({
                message: 'documents not found',
            })
        } else {
            return res.status(200).send({
                documentCount: documents.length,
                documents,
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: 'failed to get all documents - server error',
            error: error.message || error,
        })
    }
}

exports.getDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const document = await documentModel.findById(id)
        if(!document) {
            return res.status(404).send({
                message: 'document not found'
            })
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: document.uniqueName,
            Expires: 60 * 5,
        }

        const preSignedUrl = s3.getSignedUrl('getObject', params);

        return res.status(201).send({
            document,
            preSignedUrl,
        })

    } catch (error) {
        return res.status(500).send({
            message: 'error getting document by id - server error',
            error: error.message || error,
        })
    }
}

exports.newDocument = async (req, res) => {
    try {
        const { title, category, uploadedBy, isPublished } = req.body;
        if(!title || !category || !uploadedBy || !req.file) {
            return res.status(400).send({
                message: 'required fields are missing'
            })
        }
        const uniqueName = `${uuidv4()}_${req.file.originalname}`

        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: uniqueName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }

        const s3Response = await s3.upload(s3Params).promise();
        const downloadUrl = s3Response.Location

        const document = await new documentModel({
            title,
            category,
            uniqueName,
            downloadUrl,
            uploadedBy,
            isPublished: isPublished || false,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
        })
        await document.save();
        return res.status(201).send({
            message: 'document uploaded successfully',
            document,
        })
    } catch (error) {
        return res.status(500).send({
            message: 'creating a document - server error',
            error: error.message || error,
        })
    }
}

exports.updateDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const { title, category, uniqueName, downloadUrl, uploadedBy, isPublished } = req.body;
        const document = await documentModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!document) {
            return res.status(404).send({
                message: 'document not found'
            });
        }
        return res.status(201).send({
            message: 'document updated successfully',
            document,
        });
    } catch (error) {
            return res.status(500).send({
                message: 'update document by id - server error',
                error: error.message || error,
            })
    }
}

exports.deleteDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const document = await documentModel.findByIdAndDelete(id);
        if(!document) {
            return res.status(404).send({
                message: 'document not found'
            })
        } else {
            return res.status(201).send({
                message: 'document deleted successfully',
                document,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'deleting document by id - server error',
            error: error.message || error,
        })
    }
}

exports.toggleDocumentStatus = async (req, res) => {
    const {id} = req.params;
    const { isPublished } = req.body;

    try {
        const document = await documentModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true });
        if (!document) {
            return res.status(400).send({ message: 'document not found' });
        }
            return res.status(201).send({ document });

    } catch (error) {
        return res.status(500).send({
            message: 'update document published status - server error',
            error: error.message || error,
        })
    }
}

exports.getDocumentsByAudience = async (req, res) => {
    try {
        const { role } = req.user;
        if (!role) {
            return res.status(400).send({ message: 'User role is required for filtering documents.' });
        }

        const documents = await documentModel.find({
            audiences: { $in: [role] },
            isPublished: true,
        });

        if (!documents || documents.length === 0) {
            return res.status(400).send({ message: 'Documents not found' });
        }
        return res.status(200).send({ documents });
    } catch (error) {
        return res.status(500).send({
            message: 'Getting documents by role - server error',
            error: error.message || error,
        });
}




/*exports.deleteFile = async (req, res) => {
    const { url } = req.body;
    const Key = url.split('/').pop;

    try {
        await 3
            .deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key,
            })
            .promise();

        res.status(200).send({ message: 'file deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file from s3:', error)
        res.status(500).send({ message: 'failed to delete file' })
    }
}

exports.uploadFile = async (req, res) => {
    const file = req.file;
    const Key = `${uuidv4()}-${file.originalname}`;

    try {
        const uploadResult = await s3
            .upload({
                Bucket: process.env.S3_BUCKET_NAME,
                Key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            })
            .promise();

        res.status(200).json({ downloadUrl: uploadResult.Location })
        res.status(500).send({ message: 'Failed to upload file'})
    } catch (error) {

    }*/

}