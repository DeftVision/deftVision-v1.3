import {Box, Table, TableBody, TableHead, InputAdornment, OutlinedInput, TableContainer, TableCell, TableRow, IconButton, Paper, FormControl, TablePagination, TableSortLabel} from '@mui/material'
import { CheckCircleOutline, DoNotDisturb, Search } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles'

export default function UserData () {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});

    useEffect(() => {
        async function getUsers() {
            try {
                const response = await fetch('http://localhost:8005/api/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const _response = await response.json();

                if(response.ok && _response.users) {
                    setUsers(_response.users);
                } else {
                    console.error('Error fetching user data');
                }

            } catch (error) {
                console.error('failed to get userData')
            }
        }
        getUsers();
    }, []);

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
    const sortedUsers = [...users].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredUsers = sortedUsers.filter((user) => {
        return user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }


    const handleActiveStatus = async (userId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/user/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                const updatedUsers = users.map((user) =>
                user._id === userId ? { ...user, isActive: !currentStatus } : user
                )
                setUsers(updatedUsers);
            } else {
                console.error('failed to update user status')
            }
        } catch (error)  {
            console.error('error updating user status', error)
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <Box sx={{

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
                                        active={sortConfig.key === 'firstName'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('firstName')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'role'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('role')}
                                    >
                                        Role
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
                                        active={sortConfig.key === 'isActive'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('isActive')}
                                        >
                                        Active
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.location}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleActiveStatus(user._id, user.isActive)}>
                                            {user.isActive ? (
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
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>

        </Box>
    );

}