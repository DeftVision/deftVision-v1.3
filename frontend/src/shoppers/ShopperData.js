import {
    TableSortLabel,
    FormControl,
    TablePagination,
    OutlinedInput,
    InputAdornment,
    Box,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    TableCell,
    TableRow,
    IconButton,
    Paper,
    Avatar
} from '@mui/material'
import { CheckCircleOutline, DoNotDisturb, Search } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles'


export default function ShopperData ({ refreshTrigger }) {
    const theme = useTheme();
    const [shoppers, setShoppers] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});

    useEffect(() => {
        async function getShoppers () {
            try {
                const response = await fetch(`http://localhost:8005/api/shopper/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json'}
                })

                const _response = await response.json();
                if(response.ok && _response.shoppers) {
                    setShoppers(_response.shoppers);
                } else {
                    console.error('failed to get shopper data')
                }
            } catch (error) {
                console.error('error getting shopper data', error)
            }
        }
        getShoppers();
    }, [refreshTrigger])


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
    const sortedShoppers = [...shoppers].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredShoppers = sortedShoppers.filter((shopper) => {
        const searchLower = searchQuery.toLowerCase()
        return(
            shopper.dateTime.toLowerCase().includes(searchLower) ||
            shopper.location.toLowerCase().includes(searchLower) ||
            (shopper.finalScore && shopper.finalScore.toString().includes(searchLower))
        )
    })

    const displayedShoppers = filteredShoppers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }


    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        marginBottom: 2
                    }}>
                        <FormControl sx={{m: 1}}>
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
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'foodScore'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('foodScore')}
                                        >
                                            Food
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'serviceScore'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('serviceScore')}
                                        >
                                            Service
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'cleanScore'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('cleanScore')}
                                        >
                                            Cleanliness
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedShoppers.map((shopper) => (
                                    <TableRow
                                        key={shopper._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                                cursor: 'default',
                                            }
                                        }}
                                    >
                                        <TableCell>{new Date(shopper.dateTime).toLocaleDateString()}</TableCell>
                                        <TableCell>{shopper.location}</TableCell>
                                        <TableCell>{shopper.foodScore}</TableCell>
                                        <TableCell>{shopper.serviceScore}</TableCell>
                                        <TableCell>{shopper.cleanScore}</TableCell>
                                        <TableCell>
                                            {shopper.downloadUrl ? (
                                                <Avatar
                                                    src={shopper.download}
                                                    variant='square'
                                                    alt='Thumbnail'
                                                    sx={{ width: 50, height: 50}}
                                                />
                                            ) : (
                                                'No Image'
                                            )}
                                        </TableCell>
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

        </Box>
    );
};

