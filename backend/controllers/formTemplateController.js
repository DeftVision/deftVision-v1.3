const formTemplateModel = require('../models/formTemplateModel');

exports.saveFormTemplate = async (req, res) => {
    try {
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