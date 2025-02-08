import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Skeleton,
    OutlinedInput,
    InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';

export default function EmployeeData({ refreshTrigger }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refresh, setRefresh] = useState(false); // Triggers refresh after updates

    useEffect(() => {
        async function getEmployees() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/employee/`);
                const _response = await response.json();
                if (response.ok && _response.employees) {
                    setEmployees(_response.employees.map((employee) => ({
                        id: employee._id, // Use correct MongoDB ID
                        name: `${employee.firstName} ${employee.lastName}`,
                        position: employee.position,
                        location: employee.location || 'N/A',
                        isActive: employee.isActive,
                    })));
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
    }, [refreshTrigger, refresh]);

    // Handle Search Input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter Employees Based on Search Query
    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // **Fix: Ensure Status Toggles Correctly**
    const handleActiveStatus = async (employeeId, currentStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/employee/${employeeId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setEmployees((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === employeeId ? { ...user, isActive: !currentStatus } : user
                    ))
            } else {
                console.error('Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user status', error);
        }
    };

    // Define Table Columns
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'position', headerName: 'Position', width: 200 },
        { field: 'location', headerName: 'Location', flex: 1 },

        // Toggle Active Status Without Refreshing Whole Table**
        {
            field: 'isActive',
            headerName: 'Active',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={() => handleActiveStatus(params.row.id, params.row.isActive)}>
                    {params.row.isActive ? (
                        <CheckCircleOutline sx={{ color: 'dodgerblue' }} />
                    ) : (
                        <DoNotDisturb sx={{ color: '#aaa' }} />
                    )}
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Employees</Typography>
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
                    sx={{ width: 250 }}
                />
            </Box>

            {/* Data Table or Skeleton */}
            {loading ? (
                <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
            ) : (
                <DataGrid
                    rows={filteredEmployees}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    sx={{
                        backgroundColor: '#fff',
                        boxShadow: 1,
                        borderRadius: 2,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                        },
                    }}
                />
            )}
        </Box>
    );
}
