import { Box, TextField, Button, Typography, Stack} from '@mui/material'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {useAuth} from "../utilities/AuthContext"
const form_fields = {
    email: '',
    password: '',
}

export default function Login() {
    const [formData, setFormData] = useState(form_fields)
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                login(_response.token, _response.user);
                navigate('/')
            } else {
                setError(_response.message || 'Login Failed Miserably')
            }

        } catch (error) {
            console.log('login error', error)
            setError('an error occurred during login')
        }
    }

    return (
        <Box component='form'>

            <Stack direction='column' spacing={2}>
                <Typography variant='overline' sx={{fontSize: '1rem'}}>login</Typography>

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
                />

                <Button variant='outlined' onClick={handleSubmit} >
                    save
                </Button>
                { error && <Typography variant='overline' color='error'>{error}</Typography>}
                <Typography component={Link} to='/forgot-password' variant='overline' sx={{ marginTop: 5}}>forgot password</Typography>
            </Stack>
        </Box>
    );
}