// /components/ViewableAnnouncements.js
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Skeleton
} from '@mui/material';
import { ExpandMore, AccessTime } from '@mui/icons-material';

export default function ViewableAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getAnnouncements() {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    console.error('Token is missing');
                    return;
                }
                const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement/audience`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const _response = await response.json();

                if (response.ok) {
                    setAnnouncements(_response.announcements);
                } else {
                    throw new Error(_response.message || 'Failed to fetch announcements');
                }
            } catch (error) {
                setError('An error occurred while fetching announcements');
            } finally {
                setLoading(false);
            }
        }

        getAnnouncements();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'error.main';
            case 'Medium':
                return 'warning.main';
            case 'Low':
                return 'grey.500';
            default:
                return 'grey.300';
        }
    };

    return (
        <Box sx={{ px: 2, py: 4 }}>
            {loading ? (
                // Show Skeleton while loading
                [...Array(5)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 2 }} />
                ))
            ) : (
                announcements.map((announcement) => (
                    <Accordion key={announcement._id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Typography variant="h6">{announcement.title}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime fontSize="small" />
                                    <Typography variant="body2">
                                        {new Date(announcement.updatedAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: getPriorityColor(announcement.priority),
                                            fontWeight: 'bold',
                                            ml: 'auto'
                                        }}
                                    >
                                        {announcement.priority}
                                    </Typography>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1">{announcement.content}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
