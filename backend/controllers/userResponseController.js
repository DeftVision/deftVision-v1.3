const responseModel = require('../models/userResponseModel')

exports.saveUserResponse = async (req, res) => {
    try {
        const { templateId, responses } = req.body;
        const newResponse = new responseModel({
            templateId,
            responses,
        })
        await newResponse.save();

        return res.status(201).send({
            message: 'response saved successfully.',
        });
    } catch (error) {
        return res.status(500).send({
            message: 'saving user responses - server error',
        });
    }
}

exports.getUserResponse = async (req, res) => {
    try {
        const userResponse = await responseModel.find({});
        if (!userResponse) {
            return res.status(400).send({
                message: 'user responses not found.'
            })
        } else {
            return res.status(200).send({
                responseCount: userResponse.length,
                userResponse,
            })
        }

    } catch (error) {
        console.log('error getting user responses', error)
    }
}