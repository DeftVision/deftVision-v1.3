import { Box, Typography, TextField, Button, Switch, FormControlLabel, InputLabel, Select, Stack, MenuItem, IconButton, FormControl } from '@mui/material'
import { useState  } from 'react'
import { useNotification } from '../utilities/NotificationContext'
import { useAuth } from '../utilities/AuthContext'

const getLocalISO = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().slice(0, 16);
};


const form_fields = {
    dateTime: getLocalISO(),
    location: '',
    subject: '',
    description: '',
    ticketStatus: 'Submitted',
    urgency: '',
    isArchived: false
}

export default function SupportForm () {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        ...form_fields,
        location: user?.location || 'Unknown Location',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.subject || !formData.description || !formData.urgency) {
            showNotification('please fill out the required fields', 'warning')
            return
        }


        const submissionData = {
            ...formData,
            dateTime: formData.dateTime || getLocalISO(),
            location: formData.location || 'Unknown Location',
            ticketStatus: formData.ticketStatus || 'Submitted',
            isArchived: formData.isArchived ?? false,
        };

        try {
            const response = await fetch('http://localhost:8005/api/support', {
                method: 'POST',
                body: JSON.stringify(submissionData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const _response = await response.json();

            if (response.ok && _response.supportTickets) {
                setFormData({
                    ...form_fields,
                    location: user?.location || 'Unknown Location', // Reset with user's location
                });
                showNotification('Support ticket created successfully', 'success');
            } else {
                showNotification('Error saving support ticket', 'error');
            }
        } catch (error) {
            showNotification('Oops, there was an error', 'error');
        }
    };

    if(!user) {
        return (
            <Typography variant='h6' textAlign='center'>
                Please login to submit a support ticket
            </Typography>
        )
    }


return (

    <Box sx={{ display: 'flex', textAlign: 'center'}}>

        <Box component='form' onSubmit={handleSubmit}>
            <Stack direction='column' spacing={2}>
                <TextField
                    type='text'
                    label='subject'
                    value={formData.subject}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            subject: e.target.value
                        })
                    }}
                />

                <TextField
                    type='text'
                    label='description'
                    multiline
                    minRows={1}
                    value={formData.description}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            description: e.target.value
                        })
                    }}
                />
                <FormControl>
                    <InputLabel>urgency</InputLabel>
                    <Select
                        variant='outlined'
                        label='urgency'
                        value={formData.urgency}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                urgency: e.target.value,
                            })
                        }}
                        sx={{ textAlign: 'start' }}
                    >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                </FormControl>

                <Button variant='outlined' type='submit'>
                    submit ticket
                </Button>
                <Typography variant='overline' sx={{ fontSize: '.75rem' }}>
                    someone from the support team will contact you in the next 24 hours
                </Typography>
            </Stack>
        </Box>
            </Box>
    );

}

