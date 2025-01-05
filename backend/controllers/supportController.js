const supportModel = require('../models/supportModel');


exports.getSupportTickets = async (req, res) => {
    try {
        const supportTickets = await supportModel.find({})
        if (!supportTickets || !supportTickets.length === 0) {
            return res.status(400).send({
                message: 'No Tickets',
            })
        } else {
            return res.status(200).send({
                ticketCount: supportTickets.length,
                supportTickets
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: 'failed to fetch supportTickets',
            error: error.message || error,
        });
    }

}

exports.getSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const supportTicket = await supportModel.findById(id);
        if (!supportTicket) {
            return res.status(404).send({
                message: 'Ticket not found',
            })
        } else {
            return res.status(200).send({
                supportTicket
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: 'couldn\'t get support ticket: server error',
            error: error.message || error,
        })
    }
}

exports.newSupportTicket = async (req, res) => {
    try {
        const { dateTime, location, subject, description, ticketStatus, urgency, isArchived } = req.body;
        if (!dateTime || !location || !subject || !description || !urgency || !ticketStatus) {
            return res.status(400).send({
                message: 'All fields are required'
            })
        }

        const supportTicket = new supportModel({ dateTime, location, subject, description, urgency, ticketStatus, isArchived });
        await supportTicket.save();
        return res.status(201).send({
            message: 'Support ticket submitted successfully',
            supportTicket
        })

    } catch (error) {
        return res.status(500).send({
            message: 'failed to submit supportTicket - server error',
            error: error.message || error,
        })
    }
}

exports.updateSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { dateTime, location, subject, description, ticketStatus, urgency, isArchived } = req.body;
        const supportTicket = await supportModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!supportTicket) {
           return res.status(404).send({
               message: 'Ticket not found',
           })
        } else {
            return res.status(201).send({
                message: 'Support ticket updated successfully',
                supportTicket
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'Failed to update the support ticket -server error',
            error: error.message || error,
        })
    }
}

exports.deleteSupportTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const supportTicket = await supportModel.findByIdAndDelete(id, req.body);
        if (!supportTicket) {
            return res.status(404).send({
                message: 'Ticket not found',
            })
        } else {
            return res.status(201).send({
                message: 'Support ticket deleted successfully',
                supportTicket
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'Failed to delete the support ticket -server error',
            error: error.message || error,
        })
    }
}