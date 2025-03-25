// /components/Login.js
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/AuthContext';
import { useNotification } from '../utilities/NotificationContext';

const form_fields = {
    email: '',
    password: '',
};

export default function Login() {
    const [formData, setFormData] = useState(form_fields);
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

        console.log("API URL:", process.env.REACT_APP_API_URL);
        console.log("React ENV:", process.env.REACT_APP_ENV);

        try {
            console.log("API URL from env:", process.env.REACT_APP_API_URL);
            console.log("REACT_APP_ENV:", process.env.REACT_APP_ENV);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });


            if (!response.ok) {
                const errorResponse = await response.json();
                showNotification(errorResponse.message || 'Login failed', 'error');
                return;
            }

            const _response = await response.json();
            localStorage.setItem('user', JSON.stringify(_response.user));
            localStorage.setItem('token', _response.token);

            showNotification('Login successful!', 'success');
            login(_response.token, _response.user);
            navigate('/');
            console.log("API URL:", process.env.REACT_APP_API_URL);
        } catch (error) {
            showNotification('An error occurred during login', 'error');
        }
    };


    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                    Login
                </Typography>

                <TextField
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    fullWidth
                />

                <TextField
                    type="password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 2,
                        width: '100%',
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                    }}
                >
                    Login
                </Button>

                {/*<Typography
                    component={Link}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                        mt: 3,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'primary.main',
                    }}
                >
                    Forgot Password?
                </Typography>*/}
            </Box>
        </Container>
    );
}
