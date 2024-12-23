const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3')
const documentModel = require('../models/documentModel');


exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({})
        if(!documents) {
            return res.status(404).send({
                message: 'No documents found',
            })
        } else {
            return res.status(200).send({
                documentCount: documents.length,
                documents,
            })
        }

    } catch (error) {
        console.error('error getting all documents', error);
        return res.status(500).send({
            message: 'failed to get all documents',
            error,
        })
    }
}

exports.getDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const document = await documentModel.findById(id)
        if(!document) {
            return res.status(404).send({
                message: 'failed to get document'
            })
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: document.uniqueName,
            Expires: 60 * 5,
        }

        const preSignedUrl = s3.getSignedUrl('getObject', params);

        return res.status(200).send({
            document,
            preSignedUrl,
        })

    } catch (error) {
        console.error('failed to get the document', error)
        return res.status(500).send({
            message: 'error getting a document',
            error,
        })
    }
}

exports.newDocument = async (req, res) => {
    try {
        const { title, category, uploadedBy, audiences, isPublished } = req.body;
        if(!title || !category || !uploadedBy || !audiences || !req.file) {
            return res.status(400).send({
                message: 'missing values for required fields'
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
            audiences,
            isPublished: isPublished || false,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
        })
        await document.save();
        return res.status(200).send({
            message: 'document uploaded successfully',
            document,
        })
    } catch (error) {
        console.error('error creating new document', error);
        return res.status(500).send({
            message: 'failed to upload document',
            error,
        })
    }
}

exports.updateDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const { title, category, uniqueName, downloadUrl, uploadedBy, audiences, isPublished } = req.body;
        const document = await documentModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!document) {
            return res.status(404).send({
                message: 'Document not found'
            });
        }
        return res.status(200).send({
            message: 'Document updated successfully',
            document,
        });
    } catch (error) {
        console.error('error updating document', error)
            return res.status(500).send({
                message: 'failed to update document',
                error,
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
            return res.status(200).send({
                message: 'document deleted successfully',
                document,
            })
        }
    } catch (error) {
        console.error('error deleting document', error);
        return res.status(500).send({
            message: 'failed to delete document',
            error,
        })
    }
}

exports.toggleDocumentStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const { isPublished } = req.body;
        const document = await documentModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!document) {
            return res.status(404).send({
                message: 'Document not found'
            });
        }
        return res.status(200).send({
            message: 'Document updated successfully',
            document,
        });
    } catch (error) {
        console.error('error updating document', error)
        return res.status(500).send({
            message: 'failed to update document',
            error,
        })
    }
}

exports.getDocumentsByAudience = async (req, res) => {
    try {
        const { role } = req.user
        if(!role) {
            return res.status(400).send({
                message: 'User role is required for filtering documents.'
            })
        }

        console.log('Filtering documents by role: ', role)

        const documents = await documentModel.find({
            audiences: { $in: [role] },
            isPublished: true
        })

        if(!documents || documents === 0) {
            return res.status(404).send({
                message: 'No documents found'
            })
        }
        return res.status(200).send({ documents })
    } catch (error) {
        console.error('Error fetching documents')
        return res.status(500).send({message: 'server error', error })
    }
}