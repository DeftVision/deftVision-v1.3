import { Box, Typography, TextField, Button, Switch, FormControlLabel, InputLabel, Select, Stack, MenuItem, IconButton, FormControl } from '@mui/material'
import { useState  } from 'react'
import { useNotification } from '../utilities/NotificationContext'


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
    ticketStatus: 'Created',
    urgency: '',
    isArchived: false
}

export default function SupportForm () {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('FormData before POST:', formData);

        try {
            const response = await fetch('http://localhost:8005/api/support', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const _response = await response.json();
            console.log('Server Response:', _response)

            if (response.ok && _response.supportTickets) {
                setFormData(form_fields); // Reset form on success
                showNotification('Support ticket created successfully', 'success');
            } else {
                showNotification('Error saving support ticket', 'error');
            }
        } catch (error) {
            console.error('Error during the submission:', error)
            showNotification('Oops, there was an error', 'error');
        }
    };


return (

    <Box sx={{ display: 'flex', textAlign: 'center'}}>

        <Box component='form' onSubmit={handleSubmit}>
            <Stack direction='column' spacing={2}>
                <TextField
                    // auto-populate
                    type='datetime-local'
                    value={formData.dateTime}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            dateTime: e.target.value
                        })
                    }}
                />
                <TextField
                    // auto-populate
                    type='text'
                    label='location'
                    value={formData.location}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            location: e.target.value
                        })
                    }}
                />

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
                    <InputLabel>status</InputLabel>
                    <Select
                        variant='outlined'
                        label='status'
                        value={formData.ticketStatus}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                ticketStatus: e.target.value,
                            })
                        }}
                        sx={{ textAlign: 'start' }}
                    >
                        <MenuItem value="Created">Created</MenuItem>
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Review">In Review</MenuItem>
                        <MenuItem value="Blocked">Blocked</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                </FormControl>

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

                <FormControlLabel
                    control={
                        <Switch
                            name='archived'
                            checked={formData.isArchived}
                            onChange={(e) =>
                                setFormData({...formData, isArchived: e.target.checked})
                            }
                        />
                    }
                    label='Archive Ticket'
                />

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

