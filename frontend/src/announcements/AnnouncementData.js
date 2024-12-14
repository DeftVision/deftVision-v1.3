import { Box, Table, TableBody, FormControl, TableHead, TableContainer, TableCell, TableRow, TablePagination, TableSortLabel, OutlinedInput, InputAdornment, IconButton, Paper } from '@mui/material'
import {CheckCircleOutline, DoNotDisturb, Search} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'


export default function AnnouncementData ( {refreshTrigger} ) {
    const theme = useTheme();
    const [announcements, setAnnouncements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'})

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
    }, [refreshTrigger]);

    // search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    // sort columns
    const handleSort = (key) => {
        let direction = 'asc';
        if(sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})
    }

    // sort logic
    const sortedAnnouncements = [...announcements].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredAnnouncements = sortedAnnouncements.filter((announcement) => {
        return announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedEvaluations = filteredAnnouncements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

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
                    <Box>
                        <FormControl>
                            <OutlinedInput
                                id='outlined-adornment-search'
                                startAdornment={<InputAdornment position='start'><Search /></InputAdornment>}
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </FormControl>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'title'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'priority'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('priority')}
                                        >
                                            Priority
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'author'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('author')}
                                        >
                                            Author
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'isPublished'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('isPublished')}
                                        >
                                            Published
                                        </TableSortLabel>
                                    </TableCell>
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component='div'
                        count={announcements.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>

        </Box>
    );
};

