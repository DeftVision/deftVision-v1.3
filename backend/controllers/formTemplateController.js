const formTemplateModel = require('../models/formTemplateModel');


exports.saveFormTemplate = async (req, res) => {
    try {
        console.log(req.body)
        const { templateName, templateDescription, fields } = req.body;

        const newTemplate = new formTemplateModel({
            name: templateName,
            description: templateDescription,
            fields,
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
                templateCount: formTemplateModel.length,
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