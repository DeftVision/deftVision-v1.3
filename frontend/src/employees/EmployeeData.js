import {TableSortLabel, FormControl, TablePagination, OutlinedInput, InputAdornment, Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { CheckCircleOutline, DoNotDisturb, Search } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles'


export default function EmployeeData () {
    const theme = useTheme();
    const [employees, setEmployees] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});

    useEffect(() => {
        async function getEmployees () {
            try {
                const response = await fetch(`http://localhost:8005/api/employee/`, {
                    method: 'GET'
                })

                const _response = await response.json();
                if(response.ok && _response.employees) {
                    setEmployees(_response.employees);
                } else {
                    console.error('failed to get employee data')
                }

            } catch (error) {
                console.error('error getting employee data', error)
            }
        }
        getEmployees();
    }, [])

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
    const sortedEmployees = [...employees].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredEmployees = sortedEmployees.filter((employee) => {
        return employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    const handleActiveStatus = async (employeeId, currentState) => {
        try {
            const response = await fetch(`http://localhost:8005/api/employee/${employeeId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentState }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok) {
                const updatedEmployees = employees.map((employee) =>
                employee._id === employeeId ? { ...employee, isActive: !currentState } : employee
                )
                setEmployees(updatedEmployees)
            } else {
                console.error('failed to update user status')
            }
        } catch (error) {
            console.error('error updating employee status', error)
        }
    }


    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
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
                                        active={sortConfig.key === 'firstName'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('firstName')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'position'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('position')}
                                    >
                                        Position
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
                            {employees.map((employee) => (
                                <TableRow key={employee._id}>
                                    <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.location}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleActiveStatus(employee._id, employee.isActive)}>
                                            {employee.isActive ? (
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

