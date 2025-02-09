// /components/UserData.js
import {
    Box,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Skeleton,
    Typography
} from '@mui/material';
import { Search, CheckCircleOutline, DoNotDisturb, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

export default function UserData({ refreshTrigger, onEditUser = () => {} }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        async function getUsers() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const _response = await response.json();
                if (response.ok && _response.users) {
                    setUsers(_response.users);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Failed to get userData', error);
            } finally {
                setLoading(false);
            }
        }

        getUsers();
    }, [refreshTrigger]);

    const handleEditUser = (user) => {
        console.log('Editing User:', user); // Debugging - Check console logs
        onEditUser(user); // Send user data to parent
    };



    const handleSearch = (e) => setSearchQuery(e.target.value);

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
                        user._id === userId ? { ...user, isActive: !currentStatus } : user
                    )
                );
            } else {
                console.error('Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user status', error);
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        { field: 'role', headerName: 'Role', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => handleEditUser(params.row)}>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    const filteredUsers = users
        .filter((user) =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }));

    return (
        <Box sx={{ px: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <OutlinedInput
                    id="search-users"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search users"
                />
            </FormControl>
            {loading ? (
                <Box>
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={40} sx={{ mb: 2 }} />
                    ))}
                </Box>
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
                                    ? theme.palette.background.paper
                                    : theme.palette.grey[200],
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: (theme) => theme.palette.action.selected,
                            color: (theme) =>
                                theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'inherit',
                        },
                        '& .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: (theme) => theme.palette.action.hover,
                        },
                        '& .MuiDataGrid-cell': {
                            color: (theme) => theme.palette.text.primary,
                        },
                    }}
                />
            )}
        </Box>
    );
}
