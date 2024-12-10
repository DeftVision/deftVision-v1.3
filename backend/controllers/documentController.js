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
        } else {
            return res.status(200).send({
                document,
            })
        }
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
        const { title, category, uniqueName, downloadUrl, uploadedBy, access, isPublished } = req.body;
        if(!title || !category || !uniqueName || !downloadUrl || !uploadedBy || !access) {
            return res.status(404).send({
                message: 'missing values for required fields'
            })
        }
        const matchingTitle = await documentModel.findOne({ title })
        if(matchingTitle) {
            return res.status().send({
                message: 'document of the same title already exists'
            })
        }

        const document = await new documentModel({ title, category, uniqueName, downloadUrl, uploadedBy, access, isPublished })
        await document.save();
        return res.status(200).send({
            message: 'document uploaded successfully',
            document,
        })



    } catch (error) {
        console.error('error creating new document', error);
        return res.status(500).send({
            message: 'failed to create new document',
            error,
        })
    }
}

exports.updateDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const { title, category, uniqueName, downloadUrl, uploadedBy, access, isPublished } = req.body;
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