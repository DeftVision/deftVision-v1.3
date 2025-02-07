const announcementModel = require('../models/announcementModel');

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await announcementModel.find({})
        if(!announcements || announcements.length === 0) {
            return res.status(404).send({
                message: 'announcements not found'
            })
        } else {
            return res.status(200).send({
                announcementCount: announcements.length,
                announcements,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'get announcements -  server error',
            error: error.message || error,
        })
    }
}

exports.getAnnouncement = async (req, res) => {
    try {
        const {id} = req.params;
        const announcement = await announcementModel.findById(id)
        if(!announcement) {
            return res.status(404).send({
                message: 'announcement not found'
            })
        } else {
            return res.status(200).send({
                announcement
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: 'get announcement by id - server error',
            error: error.message || error,
        })

    }
}

exports.newAnnouncement = async (req, res) => {
    try {
        const { title, content, author, priority, audience = [], isPublished } = req.body;

        // if (!title || !content || !author || !priority || !Array.isArray(audience) || audience.length === 0) {
        if (!title || !content || !author || !priority || !audience) {
            return res.status(400).send({
                message: "Required fields are missing values",
            });
        }

        const announcement = new announcementModel({
            title,
            content,
            author,
            priority,
            // revert back to the original for validation of form submission
            // audience: Array.isArray(audience) ? audience : [audience],
            audience,
            isPublished
        });
        await announcement.save();

        return res.status(201).send({
            message: "Announcement created successfully",
            announcement,
        });
    } catch (error) {
        return res.status(500).send({
            message: "create announcement - server error",
            error: error.message || error,
        });
    }
};


exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, priority, audience, isPublished } = req.body;
        const announcement = await announcementModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!announcement) {
            return res.status(400).send({
                message: 'announcement not found'
            });
        } else {
            return res.status(201).send({
                announcement
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: "updating announcement by id - server error",
            error: error.message || error,
        })
    }
}

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await announcementModel.findByIdAndDelete(id)
        if(!announcement) {
            return res.status(400).send({
                message: 'announcement not found'
            })
        } else {
            return res.status(201).send({
                message: 'announcement deleted successfully'
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: 'deleting announcement by id - server error',
            error: error.message || error,
        })
    }
}

exports.togglePublishStatus = async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;

    try {
        const announcement = await announcementModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
            );
        if (!announcement) {
            return res.status(400).send({ message: 'announcement not found' });
        }
            return res.status(201).send({ announcement });

    } catch (error) {
        return res.status(500).send({
            message: "updating announcement published status - server error",
            error: error.message || error,
        })
    }
}

exports.getAnnouncementsByAudience = async (req, res) => {
    try {
        const { role } = req.user; // Role should be set by the `authMiddleware`
        if (!role) {
            return res.status(400).send({ message: 'User role is required for filtering announcements.' });
        }

        const announcements = await announcementModel.find({
            audience: { $in: [role] },
            isPublished: true,
        });

        if (!announcements || announcements.length === 0) {
            return res.status(404).send({ message: 'Announcements not found.' });
        }
        return res.status(200).send({ announcements });
    } catch (error) {
        return res.status(500).send({
            message: 'Error fetching announcements by role.',
            error: error.message || error,
        });
    }
};


