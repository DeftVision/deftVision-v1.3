import { AnnouncementForm, AnnouncementData } from '../announcements/index';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function Announcements() {
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);
    const [editData, setEditData] = useState(null);

    const toggleRefresh = () => setRefreshAnnouncements((prev) => !prev);

    const handleEditAnnouncement = (announcement) => {
        setEditData({
            ...announcement,
            audience: Array.isArray(announcement.audience)
                ? announcement.audience
                : announcement.audience.split(',').map((item) => item.trim()), // ✅ Ensure it's always an array
        });
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: 2,
                mt: 4,
                mb: 10,
            }}
        >
            <AnnouncementForm onAnnouncementSaved={toggleRefresh} editData={editData} />
            <AnnouncementData refreshTrigger={refreshAnnouncements} onEditAnnouncement={handleEditAnnouncement} />
        </Box>
    );
}


