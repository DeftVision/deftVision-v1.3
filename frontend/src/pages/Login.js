import { Box, TextField, Button, Typography, Stack} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {useAuth} from "../utilities/AuthContext"
import { useNotification } from '../utilities/NotificationContext'
const form_fields = {
    email: '',
    password: '',
}

export default function Login() {
    const [formData, setFormData] = useState(form_fields)
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const validateInputs = () => {
        const { email, password } = formData;

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showNotification('Email is required', 'warning');
            return false;
        }

        if (!emailRegex.test(email)) {
            showNotification('Invalid email format', 'warning');
            return false;
        }

        if (!password) {
            showNotification('Password is required', 'warning');
            return false;
        }

        return true; // Inputs are valid
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        try {
            const response = await fetch('http://localhost:8005/api/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const _response = await response.json();

            if(response.ok && _response.token) {
                localStorage.setItem('user', JSON.stringify(_response.user))
                localStorage.setItem('token', _response.token)

                showNotification('Login successful!', 'success');
                login(_response.token, _response.user);
                navigate('/')
            } else {
                showNotification(_response.message || 'Login Failed Miserably', 'error')
            }

        } catch (error) {
            showNotification('an error occurred during login', 'error')
        }
    }

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
                    sx={{ width: '500px' }}
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
                    sx={{ width: '500px' }}
                />

                <Button variant='outlined' onClick={handleSubmit} sx={{ justifyContent: 'center', alignSelf: 'center', width: '300px' }}>
                    Login
                </Button>
                {/*{ error && <Typography variant='overline' color='error' sx={{ textAlign: 'center'}}>{error}</Typography>}*/}
                <Typography component={Link} to='/forgot-password' variant='overline' sx={{ marginTop: 7, textAlign: 'center', textDecoration: 'none'}}>forgot password</Typography>
            </Stack>
        </Box>
    );
}