const UserResponse = require('../models/UserResponseModel')




exports.saveUserResponse = async (req, res) => {
    try {
        const { templateId, responses } = req.body;
        const newResponse = new UserResponse({
            templateId,
            responses,
        })
        await newResponse.save();

        return res.status(200).send({
            message: 'response saved successfully.',
        });
    } catch (error) {
        console.error('error saving userResponse', error);
        return res.status(500).send({
            message: 'An error occurred while saving the response.',
        });
    }
}

exports.getUserResponse = async (req, res) => {
    try {
        const userResponse = await UserResponse.find({});
        if (!userResponse) {
            return res.status(404).send({
                message: 'User responses not found.'
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