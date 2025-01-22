// /components/Employees.js
import { Box, Grid } from '@mui/material';
import { EmployeeData, EmployeeForm } from '../employees/index';
import { useState } from 'react';

export default function Employees() {
    const [refreshEmployees, setRefreshEmployees] = useState(false);

    const toggleRefresh = () => setRefreshEmployees((prev) => !prev);

    return (
        <Box sx={{ px: 2, py: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <EmployeeForm onEmployeeCreated={toggleRefresh} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EmployeeData refreshTrigger={refreshEmployees} />
                </Grid>
            </Grid>
        </Box>
    );
}
