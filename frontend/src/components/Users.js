import { Box, Paper, Stack, Typography } from '@mui/material';
import { UserData, UserForm } from '../users/index';
import { useState } from 'react';

const Users = () => {
    const [refreshUsers, setRefreshUsers] = useState(false);

    const toggleRefresh = () => setRefreshUsers(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <UserForm onUserCreatd={toggleRefresh} />
            <UserData refreshTrigger={refreshUsers}/>
        </Box>
    );
};

export default Users;