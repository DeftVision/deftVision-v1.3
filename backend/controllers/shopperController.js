const { v4: uuid } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require('../config/s3');
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
        const {
            dateTime,
            shopperName,
            location,
            greeting,
            cashier,
            orderRepeated,
            upsell,
            wait,
            foodScore,
            serviceScore,
            cleanScore,
            finalScore,
            comments,
        } = req.body;

        // Validate required fields
        if (
            !dateTime ||
            !shopperName ||
            !location ||
            !cashier ||
            !wait ||
            !foodScore ||
            !serviceScore ||
            !cleanScore ||
            !finalScore ||
            !comments
        ) {
            return res.status(400).send({
                message: 'Required fields are missing',
            });
        }

        const { fileKey } = req.body;
        let imageUrl = null;
        if (fileKey) {
            imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        }



        // Save shopper data to database
        const shopper = new shopperModel({
            dateTime,
            shopperName,
            location,
            greeting,
            cashier,
            orderRepeated,
            upsell,
            wait,
            foodScore,
            serviceScore,
            cleanScore,
            finalScore,
            comments,
            imageUrl,
            imageUniqueName: fileKey,
        });

        await shopper.save();

        // Respond with success
        return res.status(201).send({
            message: 'Shopper visit saved successfully',
            shopper,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).send({
            message: 'Saving shopper visit - server error',
            error: error.message || error,
        });
    }
};

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
        const { type } = req.query;
        const allowedMetrics = ['foodScore', 'serviceScore', 'cleanScore', 'finalScore'];

        // Validate the score type
        if (type && !allowedMetrics.includes(type)) {
            return res.status(400).send({ message: 'Invalid score type' });
        }

        // Aggregate shoppers to find the most recent score for each location
        const shoppers = await shopperModel.aggregate([
            {
                $sort: { dateTime: -1 },
            },
            {
                $group: {
                    _id: "$location", // Group by location
                    mostRecentScore: { $first: `$${type || 'finalScore'}` }, // Use the requested type or default to 'finalScore'
                },
            },
            { $match: { mostRecentScore: { $ne: null} }},
            { $sort: { mostRecentScore: -1 } },
            { $limit: 10 },
        ]);

        // Format the response
        const scores = shoppers.map((shopper, index) => ({
            rank: index + 1,
            location: shopper._id, // Location name
            score: shopper.mostRecentScore || 0, // Default to 0 if score is undefined
        }));

        // Handle the case where no scores are found
        if (!scores.length) {
            return res.status(404).send({ message: 'No scores found' });
        }

        return res.status(200).send({ scores });
    } catch (error) {
        console.log('Error fetching shopper scores:', error);
        return res.status(500).send({
            message: 'Server error while fetching scores',
            error: error.message || error,
        });
    }
};

exports.getPresignedUploadUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;

        const fileKey = `${uuid()}_${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        res.status(200).json({ presignedUrl, fileKey });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        res.status(500).json({ message: "Error generating presigned URL", error: error.message });
    }
};



