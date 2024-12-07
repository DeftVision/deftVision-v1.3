import {Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { CheckCircleOutline, DoNotDisturb } from '@mui/icons-material'
import { useState, useEffect } from 'react';



export default function EmployeeData () {
    const [employees, setEmployees] = useState([])


    useEffect(() => {
        async function getEmployees () {
            try {
                const response = await fetch(`http://localhost:8005/api/employee/`, {
                    method: 'GET'
                })

                const _response = await response.json();
                if(response.ok && _response.employees) {
                    setEmployees(_response.employees);
                } else {
                    console.error('failed to get employee data')
                }

            } catch (error) {
                console.error('error getting employee data', error)
            }
        }
        getEmployees();
    }, [])

    const handleActiveStatus = async (employeeId, currentState) => {
        try {
            const response = await fetch(`http://localhost:8005/api/employee/${employeeId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentState }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok) {
                const updatedEmployees = employees.map((employee) =>
                employee._id === employeeId ? { ...employee, isActive: !currentState } : employee
                )
                setEmployees(updatedEmployees)
            } else {
                console.error('failed to update user status')
            }
        } catch (error) {
            console.error('error updating employee status', error)
        }
    }


    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee._id}>
                                    <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.location}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleActiveStatus(employee._id, employee.isActive)}>
                                            {employee.isActive ? (
                                                <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                            ) : (
                                                <DoNotDisturb sx={{color: '#aaa'}}/>
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Box>
            </Paper>
        </Box>
    );
};

