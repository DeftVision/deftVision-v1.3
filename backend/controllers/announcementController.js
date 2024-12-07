const announcementModel = require('../models/announcementModel');

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await announcementModel.find({})
        if(!announcements) {
            return res.send({
                message: 'Announcements not found'
            })
        } else {
            return res.send({
                announcementCount: announcements.length,
                announcements,
            })
        }
    } catch (error) {
        console.error('failed getting announcement', error);
    }
}

exports.getAnnouncement = async (req, res) => {
    try {
        const {id} = req.params;
        const announcement = await announcementModel.findById(id)
        if(!announcement) {
            return res.send({
                message: 'Announcement not found'
            })
        } else {
            return res.send({
                announcement
            });
        }
    } catch (error) {
        console.error('failed getting announcement', error);
    }
}

exports.newAnnouncement = async (req, res) => {
    try {
        const { title, content, author, priorities, audiences, isPublished } = req.body;
        if(!title || !content || !author || !priorities || !audiences) {
            return res.send({
                message: "required fields are missing",
            })
        } else {
            const announcement = new announcementModel({ title, content, author, priorities, audiences, isPublished });
            await announcement.save();
            return res.send({
                message: 'Announcement created successfully',
                announcement,
            })
        }
    } catch (error) {
        console.error('failed creating announcement', error);
        return res.send({
            message: 'error creating announcement',
            error: error,
        })
    }
}

exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, priorities, audiences, isPublished } = req.body;
        const announcement = await announcementModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!announcement) {
            return res.send({
                message: 'Announcement not found'
            });
        } else {
            return res.send({
                announcement
            });
        }
    } catch (error) {
        console.error('failed updating announcement', error);
        return res.send({
            message: "Error updating announcement",
            error: error,
        })
    }
}

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await announcementModel.findByIdAndDelete(id)
        if(!announcement) {
            return res.send({
                message: 'Announcement not found'
            })
        } else {
            return res.send({
                message: 'Announcement deleted successfully'
            });
        }
    } catch (error) {
        console.error('failed getting announcement', error);
        return res.send({
            message: 'Error deleting announcement',
            error: error
        })
    }
}


//TODO: end point doesn't work
exports.togglePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;
        const announcement = await announcementModel.findByIdAndUpdate(id,  req.body, { new: true });
        if (!announcement) {
            return res.status(404).send({ message: 'Announcement not found' });
        } else {
            return res.status(200).send({ announcement });
        }
    } catch (error) {
        console.error('error toggling published status', error);
        return res.status(500).send({
            message: "Error updating announcement",
            error
        })
    }
}

