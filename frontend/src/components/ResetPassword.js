import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Stack } from '@mui/material'


export default function ResetPassword () {
    const { token } = useParams()
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8005/api/user/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({ newPassword }),
            })

            const _response = await response.json();
            setMessage(_response.message || 'reset failed')
            if(response.ok) navigate('/login')
        } catch (error) {
            console.error('reset password error: ', error)
            setMessage('an error occurred')
        }
    };

    return (
        <Box component='form' onSubmit={handleSubmit}>
            <Stack direction='column' spacing={3}>
            <Typography variant='overline'>Reset Password</Typography>
            <TextField
                label='New Password'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <Button type='submit' variant='outlined'>Reset Password</Button>
            {message && <Typography>{message}</Typography>}
            </Stack>
        </Box>
    );
}