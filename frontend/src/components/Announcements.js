import { AnnouncementForm, AnnouncementData } from '../announcements/index';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function Announcements() {
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(false);

    const toggleRefresh = () => setRefreshAnnouncements((prev) => !prev);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                width: '100%',       // Ensures it takes full width
                maxWidth: '1200px',  // Prevents stretching too wide
                px: 2,
                mt: 4,
                mb: 10,
                mx: 'auto',          // Centers the container
            }}
        >
            <AnnouncementForm onAnnouncementCreated={toggleRefresh} />
            <AnnouncementData refreshTrigger={refreshAnnouncements} />
        </Box>
    );
}
