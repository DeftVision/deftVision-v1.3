import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from "../utilities/AuthContext"
import {useNotification} from '../utilities/NotificationContext'

const form_fields = {
    email: '',
    password: '',
}

export default function Login() {
    const [formData, setFormData] = useState(form_fields)
    const [error, setError] = useState('')
    const {showNotification} = useNotification();
    const navigate = useNavigate();
    const {login} = useAuth();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8005/api/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const _response = await response.json();
            console.log('API Response:', _response);

            // Explicitly check the status code
            if (response.status === 200 && _response.token) {
                localStorage.setItem('user', JSON.stringify(_response.user));
                localStorage.setItem('token', _response.token);

                login(_response.token, _response.user);
                navigate('/');
                showNotification(_response.message || 'Login successful', 'success');
            } else if (response.status === 401 || response.status === 404) {
                showNotification(_response.message || 'Login failed: invalid credentials', 'error');
            } else {
                showNotification(_response.message || 'Login failed: unexpected error', 'error');
            }

        } catch (error) {
            console.error('Login request error:', error);
            showNotification('An error occurred during login', 'error');
        }
    };


    return (
        <Box component='form'>

            <Stack direction='column' spacing={2}>
                <Typography variant='overline' sx={{fontSize: '1rem', textAlign: 'center'}}>login</Typography>

                <TextField
                    type='email'
                    label='email'
                    value={formData.email}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            email: e.target.value
                        })
                    }}
                    sx={{width: '500px'}}
                />

                <TextField
                    type='password'
                    name='password'
                    label='password'
                    value={formData.password}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            password: e.target.value
                        })
                    }}
                    sx={{width: '500px'}}
                />

                <Button variant='outlined' onClick={handleSubmit}
                        sx={{justifyContent: 'center', alignSelf: 'center', width: '300px'}}>
                    Login
                </Button>
                <Typography
                    component={Link}
                    to='/forgot-password'
                    variant='overline'
                    sx={{
                        marginTop: 7,
                        textAlign: 'center',
                        textDecoration: 'none'
                    }}>
                    forgot password
                </Typography>
            </Stack>
        </Box>
    );
}