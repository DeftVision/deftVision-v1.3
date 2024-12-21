import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material'

export default function ViewableAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getAnnouncements() {
            try {
                const response = await fetch('http://localhost:8005/api/announcement/audience', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })

                const _response = await response.json();

                if(response.ok) {
                    setAnnouncements(_response.announcements)
                    console.log('fetched announcements')
                } else {
                    setError(_response.message || 'Failed to get announcements')
                }


            } catch (error) {
                console.error('An error occurred while fetching announcements')
            } /*finally {
                setLoading(false);
            }*/


        }
        getAnnouncements()
    }, [])

    // if(loading) return <CircularProgress />



    return (
        <Box sx={{ padding: 2}}>
            { announcements.length > 0 ? (
                announcements.map((announcement) => (
                    <Card key={announcement._id} sx={{ marginBottom: 2 }}>
                        <CardHeader
                            title={announcement.title}
                            subheader={`Published on: ${new Date(announcement.createdAt).toLocaleDateString()}`}
                        />
                        <CardContent>
                            <Typography variant='body2' color='textSecondary'>
                                {announcement.content}
                            </Typography>
                        </CardContent>

                    </Card>
                ))
            ) : (
                <Typography variant='body2'>
                    No announcements at this time
                </Typography>
            )}
        </Box>
    );

}

