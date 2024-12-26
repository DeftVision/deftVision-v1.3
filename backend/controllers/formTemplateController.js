const formTemplateModel = require('../models/formTemplateModel');

exports.saveFormTemplate = async (req, res) => {
    try {
        console.log(req.body)
        const { templateName, templateDescription, fields, status } = req.body;

        const newTemplate = new formTemplateModel({
            name: templateName,
            description: templateDescription,
            fields,
            status: status || 'draft',
        })

        await newTemplate.save();
        res.status(201).send({
            message: 'Form template saved successfully'
        })
    } catch (error) {
        console.error('error saving form template', error);
        res.status(500).send({
            message: 'failed to save template'
        })
    }
}

exports.getFormTemplates = async (req, res) => {
    try {
        const templates = await formTemplateModel.find({})
        if(!templates){
            return res.status(400).send({
                message: 'form template not found'
            })
        } else {
            res.status(200).send({
                templateCount: templates.length,
                templates,
            });
        }


    } catch (error) {
        res.status(500).send({
            message: 'getting form templates - server error',
            error: error.message || error,
        })
    }
}

exports.getPublishedTemplates = async (req, res) => {
   try {
       const templates = await formTemplateModel.find({ status: 'published' });
       if(!templates || templates.length === 0) {
           return res.status(404).send({
               message: 'No published templates found'
           })
       }
       res.status(200).send({
           templates,
       })
   } catch (error) {
       return res.status(500).send({
           message: "updating form template published status - server error",
           error: error.message || error,
       })
   }
}

exports.deleteTemplate = async (req, res) => {
    try {
        const {id} = req.params
        const template = await formTemplateModel.findByIdAndDelete(id);
        if(!template) {
            return res.status(400).send({
                message: 'template not found'
            })
        }
        res.status(201).send({
            message: 'template deleted successfully'
        })
    } catch (error) {
        return res.status(500).send({
            message: "deleting form template - server error",
            error: error.message || error,
        })
    }
}

exports.updateTemplate = async (req, res) => {
    try {
        const {id} = req.params;
        const { templateName, templateDescription, status, fields} = req.body
        const template = await formTemplateModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!template) {
            return res.status(400).send({
                message: 'template not found'
            })
        }
        res.status(201).send({
            message: 'form template updated successfully'
        })
    } catch (error) {
        return res.status(500).send({
            message: "updating form template by id - server error",
            error: error.message || error,
        })
    }
}