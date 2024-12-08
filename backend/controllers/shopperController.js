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
            return res.status(404).send({
                message: 'Please fill in all required fields'
            })
        }
        const shopper = new shopperModel({dateTime, shopperName, location, greeting, cashier, orderRepeated, upsell, wait, foodScore, serviceScore, cleanScore, finalScore, comments})
        await shopper.save();
        return res.status(200).send({
            message: 'Shopper visit saved successfully',
            shopper,
        })
    } catch (error) {
        console.error('failed to save shopper visit', error);
        return res.status(500).send({

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
