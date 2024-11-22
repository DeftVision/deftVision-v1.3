import { Box, Typography, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';

const login_fields = {
    email: '',
    password: ''
}

export default function Login() {
const [login, setLogin] = useState(login_fields);

const handleSubmit = async (e) => {
    try {
        const response = await fetch('http://localhost:8000/api/user/login', {
            method: 'POST',
            body: JSON.stringify(login),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const _response = await response.json();
        if(response.ok) {
            setLogin(_response.user)
            console.log('Successfully logged in');
        } else {
            console.error('failed to log in');
        }
    } catch (error) {
        console.error('whoops, something failed to happen')
    }
}

    return (
        <Box component='form' onSubmit={handleSubmit}>
            <Stack direction='column' spacing={2}>
                <Typography variant='overline'>login</Typography>
                <TextField
                    type='email'
                    label='email'
                    value={login.email}
                    onChange={(e) => {
                        setLogin({
                            ...login,
                            email: e.target.value,
                        })
                    }}
                />
                <TextField
                    type='password'
                    label='password'
                    value={login.password}
                    onChange={(e) => {
                        setLogin({
                            ...login,
                            password: e.target.value,
                        })
                    }}
                />
                <Button type='sumbit' variant='outlined'>login</Button>
            </Stack>
        </Box>
    );
};

