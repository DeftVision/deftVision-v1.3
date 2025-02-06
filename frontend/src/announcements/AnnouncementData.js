// /components/AnnouncementData.js
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
    TableSortLabel,
    Typography,
} from '@mui/material';
import { CheckCircleOutline, DoNotDisturb, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function AnnouncementData({ refreshTrigger }) {
    const [announcements, setAnnouncements] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        async function getAnnouncements() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement/`);
                const data = await response.json();
                if (response.ok && data.announcements) {
                    setAnnouncements(data.announcements);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getAnnouncements();
    }, [refreshTrigger]);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAnnouncements = announcements
        .filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => (sortConfig.direction === 'asc' ? a[sortConfig.key] > b[sortConfig.key] : a[sortConfig.key] < b[sortConfig.key]));

    return (
        <Box sx={{ width: '100%', px: 2, mt: 4 }}>
            <FormControl sx={{ width: '100%', mb: 2 }}>
                <OutlinedInput
                    id="search"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search announcements"
                />
            </FormControl>
            <TableContainer>
                {isLoading ? (
                    <Box>
                        {[...Array(4)].map((_, idx) => (
                            <Skeleton key={idx} variant="rectangular" height={40} sx={{ mb: 2 }} />
                        ))}
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Published', 'Title', 'Priority', 'Audience'].map((col, idx) => (
                                    <TableCell key={idx}>
                                        <TableSortLabel
                                            active={sortConfig.key === col.toLowerCase()}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort(col.toLowerCase())}
                                        >
                                            {col}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAnnouncements.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((a) => (
                                <TableRow key={a._id} hover>
                                    <TableCell>
                                        <IconButton>
                                            {a.isPublished ? (
                                                <CheckCircleOutline sx={{ color: 'green' }} />
                                            ) : (
                                                <DoNotDisturb sx={{ color: 'gray' }} />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{a.title}</TableCell>
                                    <TableCell>{a.priority}</TableCell>
                                    <TableCell>{a.audience}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAnnouncements.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </Box>
    );
}
