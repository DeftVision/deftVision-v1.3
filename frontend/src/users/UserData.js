import {Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { CheckCircleOutline, DoNotDisturb } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';




export default function UserData () {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        async function getUsers() {
            try {
                const response = await fetch('http://localhost:8005/api/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const _response = await response.json();

                if(response.ok && _response.users) {
                    setUsers(_response.users);
                } else {
                    console.error('Error fetching user data');
                }

            } catch (error) {
                console.error('failed to get userData')
            }
        }
        getUsers();
    }, []);

    const handleActiveStatus = async (userId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/user/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok) {
                const updatedUsers = users.map((user) =>
                user._id === userId ? { ...user, isActive: !currentStatus } : user
                )
                setUsers(updatedUsers);
            } else {
                console.error('failed to update user status')
            }
        } catch (error)  {
            console.error('error updating user status', error)
        }
    }

    return (
        <Box sx={{ padding: 2, marginBottom: 10, display: 'flex', textAlign: 'center' }}>
            <Paper elevation={16} sx={{width: '100%', padding: 10}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.location}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleActiveStatus(user._id, user.isActive)}>
                                            {user.isActive ? (
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
            </Paper>

        </Box>
    );

}