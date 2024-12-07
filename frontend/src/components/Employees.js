import { Box, Stack, Typography } from '@mui/material';
import { EmployeeData, EmployeeForm } from '../employees/index'


export default function Employees () {
    return (
        <Box>
            <EmployeeForm />
            <EmployeeData />
        </Box>
    );
};
