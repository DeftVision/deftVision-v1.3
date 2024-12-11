import {
    Box,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    TableCell,
    TableRow,
    IconButton,
    Paper,
    InputAdornment, OutlinedInput, FormControl, TableSortLabel
} from '@mui/material'
import {Assignment, Search} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import {TablePagination} from "@mui/base";
export default function ShopperData () {
    const theme = useTheme();
    const [shoppers, setShoppers] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setConfig] = useState({key: 'name', direction: 'asc'})

    useEffect(() => {
        async function getShopperVisits() {
            try {
                const response = await fetch('http://localhost:8005/api/shopper/', {
                    method: 'GET',
                    headers: { 'Content-Type' : 'application/json'}
                })

                const _response = await response.json();

                if(response.ok && _response.shoppers) {
                    setShoppers(_response.shoppers);
                } else {
                    console.error('error fetching shopper data')
                }

            } catch (error) {
                console.error('failed to get shopper data')
            }
        }
        getShopperVisits();
    }, []);

    const handlePublishedStatus = async (shopperId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/shopper/status${shopperId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                const updatedShoppers = shoppers.map((shopper) =>
                    shopper._id === shopperId
                        ? { ...shopper, isPublished: !currentStatus }
                        : shopper
                );
                setShoppers(updatedShoppers);
            } else {
                console.error('failed to update shopper status')
            }
        } catch (error)  {
            console.error('error updating shopper status', error)
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSort = (key) => {
        let direction = 'asc';
        if(sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setConfig({ key, direction });
    }


    // sort logic
    const sortedShoppers = [ ...shoppers].sort((a, b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    })

    const filteredShoppers = sortedShoppers.filter((evaluation) => {
        return evaluation.location.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedShoppers = filteredShoppers.slice(page * rowsPerPage * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            {/*<Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>*/}
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        marginBottom: 2
                    }}
                    >
                        <FormControl sx={{m: 1}}>
                            <OutlinedInput
                                id='outlined-adornment-search'
                                startAdornment={<InputAdornment position='start'><Search /></InputAdornment>}
                            />
                        </FormControl>
                    </Box>
                    <TableContainer sx={{ justifyContent: 'center', alignItems: 'center'}}>
                        <Table sx={{minWidth: 700}} stickyHeader aria-label='shopper evaluation data grid'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'date'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('date')}
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
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'finalScore'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('finalScore')}
                                        >
                                            Score
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shoppers.map((shopper) => (
                                    <TableRow key={shopper._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                                cursor: 'default'
                                            }
                                        }}
                                    >
                                        <TableCell>{formatDate(shopper.dateTime)}</TableCell>
                                        <TableCell>{shopper.location}</TableCell>
                                        <TableCell>{shopper.finalScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component='div'
                        count={shoppers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            {/*</Paper>*/}

        </Box>
    );
};

