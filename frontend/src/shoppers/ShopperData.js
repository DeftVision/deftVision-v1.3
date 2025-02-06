// /components/ShopperData.js
import {
    Avatar,
    Box,
    FormControl,
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
import { Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

export default function ShopperData({ refreshTrigger }) {
    const theme = useTheme();
    const [shoppers, setShoppers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'dateTime', direction: 'asc' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getShoppers() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/shopper/`);
                const _response = await response.json();
                if (response.ok && _response.shoppers) {
                    setShoppers(_response.shoppers);
                } else {
                    console.error('Failed to fetch shopper data');
                }
            } catch (error) {
                console.error('Error fetching shopper data:', error);
            } finally {
                setLoading(false);
            }
        }
        getShoppers();
    }, [refreshTrigger]);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedShoppers = [...shoppers].sort((a, b) => {
        if (sortConfig.direction === 'asc') return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredShoppers = sortedShoppers.filter((shopper) =>
        [shopper.dateTime, shopper.location, shopper.finalScore?.toString()]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const displayedShoppers = filteredShoppers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ px: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <OutlinedInput
                    id="search-shoppers"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search shoppers"
                />
            </FormControl>
            <TableContainer>
                {loading ? (
                    <Box>
                        {[...Array(5)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                height={40}
                                sx={{ mb: 2 }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'dateTime'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('dateTime')}
                                    >
                                        Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'location'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('location')}
                                    >
                                        Location
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Food Score</TableCell>
                                <TableCell>Service Score</TableCell>
                                <TableCell>Cleanliness Score</TableCell>
                                <TableCell>Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedShoppers.map((shopper) => (
                                <TableRow key={shopper._id}>
                                    <TableCell>
                                        {new Date(shopper.dateTime).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{shopper.location}</TableCell>
                                    <TableCell>{shopper.foodScore}</TableCell>
                                    <TableCell>{shopper.serviceScore}</TableCell>
                                    <TableCell>{shopper.cleanScore}</TableCell>
                                    <TableCell>
                                        {shopper.downloadUrl ? (
                                            <Avatar
                                                src={shopper.downloadUrl}
                                                variant="square"
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredShoppers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
            />
        </Box>
    );
}
