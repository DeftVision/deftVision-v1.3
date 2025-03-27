// /components/ShopperData.js
import {
    Box,
    FormControl,
    InputAdornment,
    OutlinedInput,
    Skeleton,
    Stack,
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
import {Search} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {useAuth} from '../utilities/AuthContext';

export default function ShopperData({refreshTrigger}) {
    const theme = useTheme();
    const {user} = useAuth();
    const role = user?.role;
    const [shoppers, setShoppers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({key: 'dateTime', direction: 'asc'});
    const [loading, setLoading] = useState(true);
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        async function getShoppers() {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                console.log('Token from sessionStorage:', token);

                const response = await fetch(`${process.env.REACT_APP_API_URL}/shopper/`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const _response = await response.json();
                console.log('Fetched shopper response:', _response);

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

    useEffect(() => {
        if (activeRow) {
            console.log('Selected shopper:', activeRow)
        }
    }, [activeRow]);


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
    console.log("rendering activeRow:", activeRow)
    return (
        <>
            <Box sx={{px: 2}}>
                <FormControl fullWidth sx={{mb: 2}}>
                    <OutlinedInput
                        id="search-shoppers"
                        startAdornment={
                            <InputAdornment position="start">
                                <Search/>
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
                                    sx={{mb: 2}}
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedShoppers.map((shopper) => (
                                    <TableRow key={shopper._id} onClick={() => setActiveRow(shopper)}>
                                        <TableCell>
                                            {new Date(shopper.dateTime).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{shopper.location}</TableCell>
                                        <TableCell>{shopper.foodScore}</TableCell>
                                        <TableCell>{shopper.serviceScore}</TableCell>
                                        <TableCell>{shopper.cleanScore}</TableCell>
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

            {activeRow ? (
                <Box sx={{mt: 2, border: '1px solid black', padding: 2, justifyContent: 'center'}}>
                    <Stack direction='column' spacing={2}>
                        {user.role !== "User" && (
                            <Typography>Shopper's Name: {activeRow.shopperName}</Typography>
                        )}

                        <Typography>
                            Visit Date/Time: {new Date(activeRow.dateTime).toLocaleDateString()}
                        </Typography>
                        <Typography>Location: {activeRow.location}</Typography>

                        {user.role !== "User" && (
                            <Typography>comments: {activeRow.comments}</Typography>
                        )}
                    </Stack>
                </Box>
            ) : (
                <Typography sx={{mt: 2}}>No Row selected</Typography>
            )}
        </>
    );
}
