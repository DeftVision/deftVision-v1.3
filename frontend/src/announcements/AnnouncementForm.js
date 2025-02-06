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

const formFields = {
    title: '',
    content: '',
    priority: '',
    audience: [],
    isPublished: false,
};

export default function AnnouncementForm({ onAnnouncementCreated }) {
    const [formData, setFormData] = useState(formFields);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) onAnnouncementCreated();
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
                            variant="outlined"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
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
