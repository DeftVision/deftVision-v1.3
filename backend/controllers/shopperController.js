const { v4: uuid } = require('uuid');
const s3 = require('../config/s3')
const shopperModel = require('../models/shopperModel')

exports.getShoppers = async (req, res) => {
    try {
        const shoppers = await shopperModel.find({})
        if(!shoppers) {
            return res.status(404).send({
                message: 'No shoppers found'
            })
        }
        return res.status(200).send({
            shopperCount: shoppers.length,
            shoppers,
        })
    } catch (error) {
        console.error('error getting shoppers', error);
        return res.status(500).send({
            message: 'error getting shoppers',
            error,
        })
    }
}

exports.getShopper = async (req, res) => {
    try {
        const {id} = req.params
        const shopper = await shopperModel.findById(id);
        if(!shopper) {
            return res.status(404).send({
                message: 'Shopper not found'
            })
        } else {
            return res.status(200).send({
                shopper,
            })
        }
    } catch (error) {
        console.error('error getting shopper', error);
        return res.status(500).send({
            message: 'error getting shopper',
            error: {reason: 'wtf'},
        })
    }
}

exports.newShopper = async (req, res) => {
    try {
        const { dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments } = req.body;

        if(!dateTime || !shopperName || !location || !cashier || !wait || !foodScore || !serviceScore || !cleanScore || !finalScore || !comments) {
            return res.status(400).send({
                message: 'Please fill in all required fields'
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
        return res.status(200).send({
            message: 'Shopper visit saved successfully',
            shopper,
        })
    } catch (error) {
        console.error('failed to save shopper visit', error);
        return res.status(500).send({
            message: 'Failed to save shopper visit'
        })
    }
}

exports.updateShopper = async (req, res) => {
    try {
        const {id} = req.params;
        const { dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments, uniqueName, downloadUrl } = req.body;
        const shopper = await shopperModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!shopper) {
            return res.status(404).send({
                message: 'Shopper not found'
            })
        }
        return res.status(200).send({
            message: 'Shopper visit saved successfully',
            shopper,
        })

    } catch (error) {
        console.error('this shopper failed to be updated')
        return res.status(500).send({
            message: 'error occurred updating this shopper evaluation',
            error
        })
    }
}

exports.deleteShopper = async (req, res) => {
    try {
        const {id} = req.params
        const shopper = await shopperModel.findByIdAndDelete(id);
        if(!shopper) {
            return res.status(404).send({
                message: 'the shopper evaluation was not found'
            })
        } else {
            return res.status(200).send({
                message: 'shopper evaluation was deleted successfully',
            })
        }

    } catch (error) {
        console.error('shopper evaluation failed to be deleted', error)
        return res.status(500).send({
            message: 'error occurred deleting this shopper evaluation',
            error,
        })
    }
}

exports.shopperScores = async (req, res) => {
    try {
        const metrics = ['Food Score', 'Service Score', 'Clean Score', 'Final Score'];
        const shoppers = await shopperModel.find({})
        console.log('shoppers fetched', shoppers);

        if(!shoppers || shoppers.length === 0) {
            return res.status(404).send({
                message: 'No shoppers found'
            })
        }

        const formattedShoppers = shoppers.map((shopper) => ({
            firstName: shopper.shopperName.split(' ')[0],
            lastName: shopper.shopperName.split(' ')[1] || '',
            finalScore: [shopper.foodScore, shopper.serviceScore, shopper.cleanScore, shopper.finalScore]
        }))

        console.log('formatted shoppers:', formattedShoppers);

        return res.status(200).send({
            metrics,
            shopper: formattedShoppers
        });

    } catch (error) {
        console.error('Error fetching shopper scores', error)
        return res.status(500).send({
            message: 'Error fetching shopper scores',
            error,
        })
    }
}
