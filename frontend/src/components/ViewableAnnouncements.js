import {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Skeleton,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import {AccessTime} from '@mui/icons-material'


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
                console.log('Token retrieved from sessionStorage:', token);

                if (!token) {
                    console.error('Token is missing in sessionStorage')
                    console.log('Authorization token is missing')
                    return;
                }


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
                    console.log('fetched announcements')
                } else {
                    console.log(_response.message || 'Failed to get announcements')
                }


            } catch (error) {
                console.error('An error occurred while fetching announcements', error)
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
                return 'info.main';
            default:
                return 'grey.500';
        }
    }

    const handleFilterChange = (e, newFilter) => {
        if (!newFilter) return;
        setFilter(newFilter);
        if (newFilter === 'All') {
            setFilteredAnnouncements(announcements);
        } else {
            setFilteredAnnouncements(
                announcements.filter((announcement) => announcement.priorities?.toLowerCase() === newFilter)
            )
        }
    }


    if (loading) return <Typography>Loading...</Typography>
    if (error) return <Typography color='error'>{error}</Typography>


    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            padding: 2
        }}>
            {loading ? (
                <Stack spacing={3}>
                    {Array.from({length: 3}).map((_, index) => (
                        <Card key={index} sx={{width: 300, borderRadius: 2, boxShadow: 3}}>
                            <CardHeader
                                avatar={<Skeleton variant='circular' width={40} height={40}/>}
                                title={<Skeleton variant='text' width='80%'/>}
                                subheader={<Skeleton variant='text' width='60%'/>}
                            />
                            <CardContent>
                                <Skeleton variant='rectangular' height={100}/>
                            </CardContent>
                            <CardActions>
                                <Skeleton variant='rectangular' width={80} height={80}/>
                                <Skeleton variant='rectangular' width={80} height={80}/>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            ) : error ? (
                <Typography color='error'>{error}</Typography>
            ) : (
                <>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: 3, // Adds spacing below the button group
                    }}>
                        <ToggleButtonGroup
                            value={filter}
                            exclusive
                            onChange={handleFilterChange}
                        >
                            <ToggleButton value='All'>All</ToggleButton>
                            <ToggleButton value='high'>High</ToggleButton>
                            <ToggleButton value='medium'>Medium</ToggleButton>
                            <ToggleButton value='low'>Low</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>


                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}>
                        {filteredAnnouncements.map((announcement) => (
                            <Card
                                key={announcement._id}
                                sx={{
                                    width: {
                                        xs: '100%', sm: 300
                                        },
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    marginLeft: 2,
                                    marginBottom: 2

                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Tooltip title={`Priority: ${announcement.priorities || 'unknown'}`}>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: getPriorityColor(announcement.priorities)
                                                }}
                                            >
                                                {announcement.title.charAt(0)}
                                            </Avatar>
                                        </Tooltip>
                                    }
                                    title={announcement.title}
                                    subheader={
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <AccessTime fontSize='small' sx={{marginRight: 0.5}}/>
                                            {announcement.updatedAt
                                                ? new Date(announcement.updatedAt).toLocaleDateString()
                                                : 'invalid date'}
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    <Typography variant='body2' color='textSecondary'>
                                        {announcement.content || 'No additional details provided'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </>
            )}

        </Box>
    );

}

