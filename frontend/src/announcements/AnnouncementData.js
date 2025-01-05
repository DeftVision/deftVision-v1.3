import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from '@mui/material'
import {CheckCircleOutline, DoNotDisturb, Search} from '@mui/icons-material'
import {useEffect, useState} from 'react'
import {useTheme} from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { Download } from '@mui/icons-material';
import {exportToCSV} from "../utilities/CsvExporter";

export default function AnnouncementData({refreshTrigger}) {
    const theme = useTheme();
    const [announcements, setAnnouncements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'})
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true)

        async function getAnnouncements() {
            try {
                const response = await fetch('http://localhost:8005/api/announcement/', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })

                const _response = await response.json();

                if (response.ok && _response.announcements) {
                    setAnnouncements(_response.announcements);
                } else {
                    console.log('error fetching announcement data')
                }

            } catch (error) {
                console.log('failed to get announcement data')
            } finally {
                setIsLoading(false);
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
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})
    }

    // sort logic
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredAnnouncements = sortedAnnouncements.filter((announcement) => {
        return announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedAnnouncements = filteredAnnouncements.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    const handlePublishedStatus = async (announcementId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8005/api/announcement/status/${announcementId}`, {
                method: 'PATCH',
                body: JSON.stringify({isPublished: !currentStatus}),
                headers: {'Content-Type': 'application/json'}
            })

            if (response.ok) {
                const updatedAnnouncements = announcements.map((announcement) =>
                    announcement._id === announcementId
                        ? {...announcement, isPublished: !currentStatus}
                        : announcement
                );
                setAnnouncements(updatedAnnouncements);
            } else {
                setError('failed to update announcement status')
            }
        } catch (error) {
            setError('error updating announcement status')
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                <Box>
                    <FormControl>
                        <OutlinedInput
                            id='outlined-adornment-search'
                            startAdornment={<InputAdornment position='start'><Search/></InputAdornment>}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </FormControl>
                </Box>
                <TableContainer>
                    {isLoading ? (
                        <Box>
                            {[...Array(4)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant='rectangular'
                                    height={25}
                                    width='100%'
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'isPublished'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('isPublished')}
                                        >
                                            Published
                                        </TableSortLabel>
                                    </TableCell>
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
                                            Audience
                                        </TableSortLabel>
                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedAnnouncements.map((announcement) => (
                                    <TableRow
                                        key={announcement._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                                cursor: 'default',
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handlePublishedStatus(announcement._id, announcement.isPublished)}>
                                                {announcement.isPublished ? (
                                                    <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                                ) : (
                                                    <DoNotDisturb sx={{color: '#aaa'}}/>
                                                )}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{announcement.title}</TableCell>
                                        <TableCell>{announcement.priorities}</TableCell>
                                        <TableCell>{announcement.audiences}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
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
        </Box>
    );
};

