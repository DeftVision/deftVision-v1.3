// /components/Employees.js
import { EmployeeForm, EmployeeData } from '../employees/index';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function Employees() {
    const [refreshEmployees, setRefreshEmployees] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);

    const toggleRefresh = () => setRefreshEmployees((prev) => !prev);
    const handleEditEmployee = (employee) => {
        console.log("Editing Employee:", employee);
        setEditEmployee(employee);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: 2,
                mt: 4,
                mb: 10,
            }}
        >
            <EmployeeForm onEmployeeSaved={toggleRefresh} editData={editEmployee} />
            <EmployeeData refreshTrigger={refreshEmployees} onEditEmployee={handleEditEmployee} />
        </Box>
    );
}
