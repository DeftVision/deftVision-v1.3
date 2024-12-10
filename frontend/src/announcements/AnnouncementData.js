import { Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper } from '@mui/material'
import { CheckCircleOutline, DoNotDisturb } from '@mui/icons-material'
import { useState, useEffect } from 'react'

export default function AnnouncementData () {
    const [announcements, setAnnouncements] = useState([])

    useEffect(() => {
        async function getAnnouncements() {
            try {
                const response = await fetch('http://localhost:8005/api/announcement/', {
                    method: 'GET',
                    headers: { 'Content-Type' : 'application/json'}
                })

                const _response = await response.json();

                if(response.ok && _response.announcements) {
                    setAnnouncements(_response.announcements);
                } else {
                    console.error('error fetching announcement data')
                }

            } catch (error) {
                console.error('failed to get announcement data')
            }
        }
        getAnnouncements();
    }, []);

    const handlePublishedStatus = async (announcementId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/announcement/status${announcementId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                const updatedAnnouncements = announcements.map((announcement) =>
                    announcement._id === announcementId
                        ? { ...announcement, isPublished: !currentStatus }
                        : announcement
                );
                setAnnouncements(updatedAnnouncements);
            } else {
                console.error('failed to update announcement status')
            }
        } catch (error)  {
            console.error('error updating announcement status', error)
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Published</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {announcements.map((announcement) => (
                                    <TableRow key={announcement._id}>
                                        <TableCell>{announcement.title}</TableCell>
                                        <TableCell>{announcement.priorities}</TableCell>
                                        <TableCell>{announcement.author}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handlePublishedStatus(announcement._id, announcement.isPublished)}>
                                                {announcement.isPublished ? (
                                                    <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                                ) : (
                                                    <DoNotDisturb sx={{color: '#aaa'}}/>
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

        </Box>
    );
};

