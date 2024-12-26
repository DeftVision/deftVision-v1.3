const { v4: uuid } = require('uuid');
const s3 = require('../config/s3')
const shopperModel = require('../models/shopperModel')

exports.getShoppers = async (req, res) => {
    try {
        const shoppers = await shopperModel.find({})
        if(!shoppers) {
            return res.status(400).send({
                message: 'shopper not found'
            })
        }
        return res.status(200).send({
            shopperCount: shoppers.length,
            shoppers,
        })
    } catch (error) {
        return res.status(500).send({
            message: 'getting shoppers -  server error',
            error: error.message || error,
        })
    }
}

exports.getShopper = async (req, res) => {
    try {
        const {id} = req.params
        const shopper = await shopperModel.findById(id);
        if(!shopper) {
            return res.status(400).send({
                message: 'shopper not found'
            })
        } else {
            return res.status(200).send({
                shopper,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'getting shopper by id - server error',
            error: error.message || error,
        })
    }
}

exports.newShopper = async (req, res) => {
    try {
        const { dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments } = req.body;

        if(!dateTime || !shopperName || !location || !cashier || !wait || !foodScore || !serviceScore || !cleanScore || !finalScore || !comments) {
            return res.status(400).send({
                message: 'required fields are missing'
            })
        }

        let imageUrl = null;
        let imageUniqueName = null;
        if(req.file) {
            imageUniqueName = `${uuid()}_${req.file.originalname}`;
            const s3Params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imageUniqueName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }

            const s3Response = await s3.upload(s3Params).promise();
            imageUrl = s3Response.Location
        }

        const shopper = new shopperModel({dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments, imageUrl, imageUniqueName})
        await shopper.save();
        return res.status(201).send({
            message: 'Shopper visit saved successfully',
            shopper,
        })
    } catch (error) {
        return res.status(500).send({
            message: 'saving shopper visit - server error',
            error: error.message || error,
        })
    }
}

exports.updateShopper = async (req, res) => {
    try {
        const {id} = req.params;
        const { dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments, uniqueName, downloadUrl } = req.body;
        const shopper = await shopperModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!shopper) {
            return res.status(400).send({
                message: 'shopper not found'
            })
        }
        return res.status(201).send({
            message: 'Shopper visit saved successfully',
            shopper,
        })

    } catch (error) {
        return res.status(500).send({
            message: 'updating shopper by id - server error',
            error: error.message || error
        })
    }
}

exports.deleteShopper = async (req, res) => {
    try {
        const {id} = req.params
        const shopper = await shopperModel.findByIdAndDelete(id);
        if(!shopper) {
            return res.status(404).send({
                message: 'shopper visit not found'
            })
        } else {
            return res.status(201).send({
                message: 'shopper visit was deleted successfully',
                shopper,
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: 'deleting shopper visit - server error',
            error: error.message || error,
        })
    }
}

exports.shopperScores = async (req, res) => {
    try {
        const metrics = ['Food Score', 'Service Score', 'Clean Score', 'Final Score'];
        const shoppers = await shopperModel.find({})

        if(!shoppers || shoppers.length === 0) {
            return res.status(400).send({
                message: 'shoppers not found'
            })
        }

        const formattedShoppers = shoppers.map((shopper) => ({
            firstName: shopper.shopperName.split(' ')[0],
            lastName: shopper.shopperName.split(' ')[1] || '',
            finalScore: [shopper.foodScore, shopper.serviceScore, shopper.cleanScore, shopper.finalScore]
        }))

        return res.status(200).send({
            metrics,
            shopper: formattedShoppers
        });

    } catch (error) {
        return res.status(500).send({
            message: 'getting shopper scores - server error',
            error: error.message || error,
        })
    }
}
