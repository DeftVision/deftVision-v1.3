// /components/SupportForm.js
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    Stack,
    Typography,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import { useAuth } from '../utilities/AuthContext';

const getLocalISO = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
};

const form_fields = {
    dateTime: getLocalISO(),
    location: '',
    subject: '',
    description: '',
    ticketStatus: 'Submitted',
    urgency: '',
    isArchived: false,
};

export default function SupportForm({ onSupportTicketCreated }) {
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

        if (!formData.subject || !formData.description || !formData.urgency) {
            showNotification('Please fill out the required fields', 'warning');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/support`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const _response = await response.json();

            if (response.ok && _response.supportTickets) {
                setFormData({ ...form_fields });
                onSupportTicketCreated();
                showNotification('Support ticket created successfully', 'success');
            } else {
                showNotification('Error saving support ticket', 'error');
            }
        } catch (error) {
            console.error('Error submitting support ticket:', error);
            showNotification('Error submitting support ticket', 'error');
        }
    };

    if (!user) {
        return (
            <Typography variant="h6" textAlign="center">
                Please log in to submit a support ticket.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', p: 2 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Urgency</InputLabel>
                        <Select
                            variant='standard'
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Urgent">Urgent</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">
                        Submit Ticket
                    </Button>
                    <Typography variant="body2" color="textSecondary" textAlign="center">
                        Someone from the support team will contact you within 24 hours.
                    </Typography>
                </Stack>
            </form>
        </Box>
    );
}
