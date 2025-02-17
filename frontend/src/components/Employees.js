import { Box } from '@mui/material';
import { EmployeeData, EmployeeForm } from '../employees/index'
import { useState } from 'react';

export default function Employees () {
    const [refreshEmployees, setRefreshEmployees] = useState(false)

    const toggleRefresh = () => setRefreshEmployees(prev => !prev)
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <EmployeeForm onEmployeeCreated={toggleRefresh} />
            <EmployeeData  refreshTrigger={refreshEmployees} />
        </Box>
    );
};
