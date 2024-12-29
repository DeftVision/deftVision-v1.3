import {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import {AccessTime} from '@mui/icons-material'
import CardTemplate from './CardTemplate'

export default function ViewableAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        async function getAnnouncements() {
            try {

                const token = sessionStorage.getItem('token');
                if (!token) return;
                const response = await fetch('http://localhost:8005/api/announcement/audience', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                const _response = await response.json();

                if (response.ok) {
                    setAnnouncements(_response.announcements)
                    setFilteredAnnouncements(_response.announcements);
                }
            } catch (error) {
                setError('An error occurred while fetching announcements')
            } finally {
                setLoading(false);
            }
        }
        getAnnouncements()
    }, [])

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
    }

    const handleFilterChange = (e, newFilter) => {
        if (!newFilter) return;
        setFilter(newFilter);
        setFilteredAnnouncements(
            newFilter === 'All' ? announcements : announcements.filter(
                (announcement) =>
                    announcement.priorities?.toLowerCase() === newFilter.toLowerCase()
            )
        )
    }

    return (
        <Box>

            <Stack direction='column' spacing={3}>
            <Box
                sx={{
                    display: 'flex', justifyContent: 'center', marginBottom: 3
                }}
            >
                <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange}>
                    <ToggleButton value='All'>All</ToggleButton>
                    <ToggleButton value='High'>High</ToggleButton>
                    <ToggleButton value='Mediuam'>Medium</ToggleButton>
                    <ToggleButton value='low'>Low</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                    padding: 3
                }}
            >
                {filteredAnnouncements.map((announcement) => (
                        <CardTemplate
                            key={announcement._id}
                            title={announcement.title}
                            subtitle={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime fontSize='mall' sx={{ marginRight: 0.5 }} />
                                    {announcement.updateAt
                                        ? new Date(announcement.updatedAt).toLocaleDateString()
                                        : 'Invalid date'}
                                </Box>
                            }
                            avatar={
                            <Avatar
                                sx={{
                                    backgroundColor: getPriorityColor(announcement.priorities),
                                }}
                            >
                                {announcement.title.charAt(0)}
                            </Avatar>
                            }
                            content={
                                <Typography variant='body2'>
                                    {announcement.content || 'No details available'}
                                </Typography>
                            }
                        />
                    ))}
            </Box>
    </Stack>
        </Box>
    );

}

