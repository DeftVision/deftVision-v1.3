// /components/AnnouncementForm.js
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Stack,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import { priorities, audiences } from '../utilities/index';
import { useNotification } from '../utilities/NotificationContext';

const form_fields = {
    title: '',
    content: '',
    priority: '',
    audience: [],
    isPublished: false,
};

export default function AnnouncementForm({ onAnnouncementCreated }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    /*const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const _response = await response.json();
            if (response.ok && _response.announcement) {
                setFormData(form_fields);
                onAnnouncementCreated();
                showNotification('Announcement created successfully', 'success');
            } else {
                showNotification('Error saving announcement', 'error');
            }
            console.log(response)
        }

        /!*try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`, {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    audience: formData.audience || []
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) onAnnouncementCreated();
        }*!/ catch (error) {
            console.error('Error creating announcement:', error);
        }
    };*/
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Ensure token is included

        const payload = {
            ...formData,
            author: JSON.parse(localStorage.getItem('user'))?.email || 'unknown',  // Ensure author is included
            audience: formData.audience || [], // Ensure audience is always an array
        };

        console.log("Submitting Announcement Payload:", payload); // Debugging

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Ensure token is included
                },
            });

            const _response = await response.json();
            console.log("Response:", _response); // Debugging
            if (response.ok) {
                setFormData(form_fields);
                onAnnouncementCreated();
                showNotification('Announcement created successfully', 'success');
            } else {
                showNotification(_response.message || 'Error saving announcement', 'error');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    };


    return (
        <Box sx={{ width: '100%', px: 2, mb: 4 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        multiline
                        rows={4}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            label='Prioirty'
                            variant="outlined"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Audience</InputLabel>
                        {/*
                           TODO: if code works remove the code that is commented out.
                         */}
                       {/* <Select
                            variant="outlined"
                            label="Audience"
                            multiple
                            value={formData.audience.length > 0 ? formData.audience : []} // Always use an array
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        >
                            <MenuItem value="Users">Users</MenuItem>
                            <MenuItem value="Shoppers">Shoppers</MenuItem>
                            <MenuItem value="Admins">Admins</MenuItem>
                        </Select>*/}
                        <Select
                            variant="outlined"
                            label="Audience"
                            multiple
                            value={formData.audience.length > 0 ? formData.audience : []} // Always use an array
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        >
                            {audiences.map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                        }
                        label="Published"
                    />
                    <Button type="submit" variant="contained">
                        Save Announcement
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
