import { Box, Typography, TextField, Button, Select, Stack, MenuItem, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

export default function SupportForm () {
    return (
        <Box sx={{ display: 'flex', textAlign: 'center'}}>
            <Stack direction='column' spacing={2}>
                <Box component='form'>

                    <TextField
                        // auto-populate
                        type='datetime-local'
                        aria-readonly={true}
                    />
                    <TextField
                        // auto-populate
                        type='text'
                        label='location'
                    />

                    <TextField
                        type='text'
                        label='subject'
                    />

                    <TextField
                        type='text'
                        label='Description'
                        multiline
                        rows={5}
                    />

                    <TextField
                        type='text'
                        label='steps to reproduce'
                        multiline
                        rows={5}
                    />


                    <Button variant='outlined'>
                        submit ticket
                    </Button>
                    <Typography variant='overline' sx={{ fontSize: '.75rem' }}>
                        someone from the support team will contact you in the next 24 hours
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );

}