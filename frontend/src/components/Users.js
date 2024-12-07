import { Box, Stack, Typography } from '@mui/material';
import { UserData, UserForm } from '../users/index';
const Users = () => {
    return (
        <Box>
            <UserForm />
            <UserData />
        </Box>
    );
};

export default Users;