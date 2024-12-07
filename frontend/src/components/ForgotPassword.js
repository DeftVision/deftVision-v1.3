import { useState } from 'react'
import { Box, TextField, Button, Typography, Stack } from '@mui/material'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/user/forgot-password',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const _response = await response.json();
            setMessage(_response.message || 'request failed');
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage('An error Occurred')
        }
    }
        return (
            <Box component='form' onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3}>
                    <Typography variant='overline'>Forgot Password</Typography>
                    <TextField
                        label='Email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type='submit' variant='outlined'>Request Password Reset</Button>
                    {message && <Typography>{message}</Typography>}
                </Stack>
            </Box>
        );

}