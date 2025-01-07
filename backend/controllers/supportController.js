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

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        if (!subject || !description || !location || !urgency) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const supportTicket = new supportModel({
            dateTime: dateTime || new Date(),
            location,
            subject,
            description,
            ticketStatus: ticketStatus || 'Open',
            urgency: urgency || 'Low',
            isArchived: isArchived || false,
            createdBy: req.user.id, // Use authenticated user's ID
        });

        await supportTicket.save();

        return res.status(201).json({
            message: 'Support ticket created successfully',
            supportTicket,
        });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        return res.status(500).json({
            message: 'Failed to create support ticket - server error',
            error: error.message,
        });
    }
};



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

exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id; // Authenticated user's ID from the token

        if (!userId) {
            return res.status(400).send({ message: 'User ID is missing from request' });
        }

        const tickets = await supportModel.find({ createdBy: userId }).sort({ dateTime: -1 });

        if (!tickets || tickets.length === 0) {
            return res.status(404).send({ message: 'No tickets found for this user' });
        }

        return res.status(200).send({ tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        return res.status(500).send({
            message: 'Failed to fetch support tickets - server error',
            error: error.message,
        });
    }
};
