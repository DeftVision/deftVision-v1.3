import { Box, Paper, Stack, Typography } from '@mui/material';
import { UserData, UserForm } from '../users/index';


const Users = () => {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <UserForm />
            <UserData />
        </Box>
    );
};

export default Users;