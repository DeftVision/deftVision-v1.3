// /components/Users.js
import { useState } from 'react';
import { UserForm, UserData } from '../users/index';
import { Box } from '@mui/material';
//import position from '../utilities/index'; // ✅ Import predefined positions

export default function Users() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshUsers, setRefreshUsers] = useState(false);

    const handleUserUpdate = () => {
        setRefreshUsers((prev) => !prev); // ✅ Refresh the users table after updating
    };

    const handleEditUser = (user) => {
        console.log('User selected for edit:', user); // Debugging step
        setSelectedUser(user); // ✅ Set user data for editing
    };

    const handleUserSaved = () => {
        setSelectedUser(null); // ✅ Reset form after save
        setRefreshUsers((prev) => !prev); // ✅ Refresh table data
    };

    return (
        <Box sx={{ px: 2, mt: 4 }}>
            {/* ✅ Pass selectedUser instead of undefined editUserData */}
            <UserForm onUserUpdated={handleUserUpdate} editData={selectedUser} />

            {/* ✅ Pass handleEditUser to enable editing */}
            <UserData refreshTrigger={refreshUsers} onEditUser={handleEditUser} />
        </Box>
    );
}
