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
    Typography,
} from '@mui/material';
import { Search, Edit } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

export default function EmployeeData({ refreshTrigger, onEditEmployee }) {
    const theme = useTheme();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userLocation = sessionStorage.getItem('userLocation'); // Get user's location
    const userRole = sessionStorage.getItem('userRole'); // Get user's role

    useEffect(() => {
        async function fetchEmployees() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/employee`);
                const _response = await response.json();

                console.log("🔹 Employee API Response:", _response); // Backend response check

                if (response.ok && _response.employees) {
                    let fetchedEmployees = _response.employees.map((emp) => ({
                        id: emp._id,
                        name: `${emp.firstName} ${emp.lastName}`,
                        position: emp.position,
                        location: emp.location,
                    }));

                    console.log("🔹 Mapped Employees:", fetchedEmployees); // Log transformed data

                    setEmployees(
                        _response.employees.map((emp) => ({
                            id: emp._id,
                            name: `${emp.firstName} ${emp.lastName}`,
                            position: emp.position,
                            location: emp.location,
                            isActive: emp.isActive,
                        }))
                    );

                    setFilteredEmployees(fetchedEmployees);
                } else {
                    throw new Error(_response.message || 'Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError(error.message);
                setEmployees([]);
                setFilteredEmployees([]);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [refreshTrigger]);


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredEmployees(
            employees.filter((employee) =>
                employee.name.toLowerCase().includes(query) ||
                employee.position.toLowerCase().includes(query) ||
                employee.location.toLowerCase().includes(query)
            )
        );
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
        setFilteredEmployees((prev) =>
            [...prev].sort((a, b) =>
                sortConfig.direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
            )
        );
    };

    const handleEditEmployee = (employee) => {
        console.log("🔹 Editing Employee Data Sent to Form:", employee); // ✅ Debugging
        onEditEmployee(employee);
    };



    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => setRowsPerPage(+e.target.value);

    return (
        <Box sx={{ px: 2, textAlign: 'center' }}>
            {/* Search Input */}
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

            {/* Table */}
            <TableContainer>
                {loading ? (
                    <Box>
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={40} sx={{ mb: 2 }} />
                        ))}
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'name'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('name')}
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
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.location}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => onEditEmployee(employee)}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
