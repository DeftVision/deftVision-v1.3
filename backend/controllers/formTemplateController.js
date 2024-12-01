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
            return res.status(404).send({
                message: 'Form template not found'
            })
        } else {
            res.send({
                templateCount: templates.length,
                templates,
            });
        }


    } catch (error) {
        console.log('failed getting all form templates', error)
        res.status(500).send({
            message: 'failed to get form template',
            error: error,
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

   }
}

exports.deleteTemplate = async (req, res) => {
    try {
        const {id} = req.params
        const template = await formTemplateModel.findByIdAndDelete(id);
        if(!template) {
            console.log('template not found')
        }
        res.status(200).send({
            message: 'Template deleted successfully'
        })
    } catch (error) {

    }
}

exports.updateTemplate = async (req, res) => {
    try {
        const {id} = req.params;
        const { templateName, templateDescription, status, fields} = req.body
        const template = await formTemplateModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!template) {
            console.log('template not found')
        }
        res.status(200).send({
            message: 'Template updated successfully'
        })
    } catch (error) {

    }
}