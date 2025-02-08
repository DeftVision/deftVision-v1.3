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
