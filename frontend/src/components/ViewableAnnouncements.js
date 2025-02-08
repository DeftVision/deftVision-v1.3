import { useEffect, useState } from 'react';
import { Avatar, Box, Stack, ToggleButton, ToggleButtonGroup, Typography, Grid } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import CardTemplate from './CardTemplate';
import audiences from '../utilities/Audiences';
export default function ViewableAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [filter, setFilter] = useState('All');

    // Get the user role from localStorage (or your authentication provider)
    const userRole = JSON.parse(localStorage.getItem('user'))?.role || "User"; // Default to "User"

    useEffect(() => {
        async function getAnnouncements() {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    console.error('Token is missing');
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const _response = await response.json();
                console.log("Fetched Announcements:", _response.announcements); // Debugging

                if (response.ok) {
                    const roleFilteredAnnouncements = _response.announcements.filter(announcement => {
                        console.log("Checking Announcement:", announcement.title);
                        console.log("Announcement Audience:", announcement.audience);
                        console.log("User Role:", userRole);

                        return announcement.audience.some(aud => audiences.includes(aud) && aud === userRole);
                    });

                    console.log("User Role:", userRole);
                    console.log("Announcements Before Filtering:", _response.announcements);
                    console.log("Announcements After Filtering:", roleFilteredAnnouncements);

                    setAnnouncements(roleFilteredAnnouncements);
                    setFilteredAnnouncements(roleFilteredAnnouncements);
                } else {
                    console.error('Error fetching announcements:', _response);
                }
            } catch (error) {
                console.error('Fetch error:', error);
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

    const handleFilterChange = (e, newFilter) => {
        if (!newFilter) return;
        setFilter(newFilter);
        setFilteredAnnouncements(
            newFilter === 'All'
                ? announcements
                : announcements.filter(
                    (announcement) =>
                        announcement.priority?.toLowerCase() === newFilter.toLowerCase()
                )
        );
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <Box sx={{ px: 2, py: 4 }}>
            <Stack direction="column" spacing={3}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 3,
                        flexWrap: 'wrap',
                        gap: 1,
                    }}
                >
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        sx={{ flexWrap: 'wrap' }}
                    >
                        <ToggleButton value="All">All</ToggleButton>
                        <ToggleButton value="High">High</ToggleButton>
                        <ToggleButton value="Medium">Medium</ToggleButton>
                        <ToggleButton value="Low">Low</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                    {filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((announcement) => (
                            <Grid item xs={12} sm={6} md={4} key={announcement._id}>
                                <CardTemplate
                                    title={announcement.title}
                                    subtitle={
                                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTime fontSize="small" sx={{ marginRight: 0.5 }} />
                                            {announcement.updatedAt
                                                ? new Date(announcement.updatedAt).toLocaleDateString()
                                                : 'Invalid date'}
                                        </Box>
                                    }
                                    avatar={
                                        <Avatar
                                            sx={{
                                                backgroundColor: getPriorityColor(announcement.priority),
                                            }}
                                        >
                                            {announcement.title.charAt(0)}
                                        </Avatar>
                                    }
                                    content={
                                        <Typography component="div" variant="body2">
                                            {truncateText(announcement.content || 'No details available', 100)}
                                        </Typography>
                                    }
                                />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', color: 'grey.600' }}>
                            No announcements available.
                        </Typography>
                    )}
                </Grid>
            </Stack>
        </Box>
    );
}
