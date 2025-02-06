// /components/EmployeeData.js
import {
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    TableSortLabel,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Skeleton,
} from '@mui/material';
import { Search, CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

export default function EmployeeData({ refreshTrigger }) {
    const theme = useTheme();
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getEmployees() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/employee/`);
                const _response = await response.json();
                if (response.ok && _response.employees) {
                    setEmployees(_response.employees);
                } else {
                    console.error('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setLoading(false);
            }
        }
        getEmployees();
    }, [refreshTrigger]);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedEmployees = [...employees].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredEmployees = sortedEmployees.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedEmployees = filteredEmployees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => setRowsPerPage(+e.target.value);

    const handleActiveStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/employee/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((employee) =>
                        employee._id === id ? { ...employee, isActive: !currentStatus } : employee
                    )
                );
            } else {
                console.error('Failed to update employee status');
            }
        } catch (error) {
            console.error('Error updating employee status:', error);
        }
    };


    return (
        <Box sx={{ px: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <OutlinedInput
                    id="search-employees"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search employees"
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
                            {displayedEmployees.map((employee) => (
                                <TableRow key={employee._id}>
                                    <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.location}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() =>
                                                handleActiveStatus(employee._id, employee.isActive)
                                            }
                                        >
                                            {employee.isActive ? (
                                                <CheckCircleOutline sx={{ color: 'dodgerblue' }} />
                                            ) : (
                                                <DoNotDisturb sx={{ color: '#aaa' }} />
                                            )}
                                        </IconButton>
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
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}
