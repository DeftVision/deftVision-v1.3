import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Skeleton,
    TextField, OutlinedInput, InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleOutline, DoNotDisturb, Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function UserData({ refreshTrigger }) {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refresh, setRefresh] = useState(false); // Triggers refresh after updates

    useEffect(() => {
        async function getUsers() {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const _response = await response.json();

                if (response.ok && _response.users) {
                    setUsers(_response.users.map((user) => ({
                        id: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        role: user.role,
                        location: user.location || 'N/A',
                        isActive: user.isActive,
                    })));
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Failed to get user data');
            } finally {
                setLoading(false);
            }
        }
        getUsers();
    }, [refreshTrigger, refresh]);

    // Handle Search Input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter Users Based on Search
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle Active Status Toggle
    const handleActiveStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
               setUsers((prevUsers) =>
                   prevUsers.map((user) =>
                    user.id === userId ? { ...user, isActive: !currentStatus } : user
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
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'location', headerName: 'Location', flex: 1 },

        // Active Status Column with Toggle Button
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
                <Typography variant="h6">Users</Typography>

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
            </Box>

            {/* Data Table or Skeleton */}
            {loading ? (
                <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
            ) : (
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    pageSize={10}
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                            backgroundColor: (theme) => theme.palette.background.default,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.background.paper // Dark mode header background
                                    : theme.palette.grey[200], // Light mode header background
                            color: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.text.primary // Dark mode header text
                                    : theme.palette.text.primary, // Light mode header text
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: (theme) => theme.palette.action.selected,
                            color: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.text.secondary // Dark text for selected row in dark mode
                                    : 'inherit', // Keep default for light mode
                        },
                        '& .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: (theme) => theme.palette.action.hover, // Adjust hover state
                        },
                        '& .MuiDataGrid-cell': {
                            color: (theme) => theme.palette.text.primary, // Default text color for all rows
                        },
                    }}
                />
            )}
        </Box>
    );
}
