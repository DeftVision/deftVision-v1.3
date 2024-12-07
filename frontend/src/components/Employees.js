import { Box } from '@mui/material';
import { EmployeeData, EmployeeForm } from '../employees/index'


export default function Employees () {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <EmployeeForm />
            <EmployeeData />
        </Box>
    );
};
