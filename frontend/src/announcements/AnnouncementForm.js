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
import { useState, useEffect } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import audiences from '../utilities/Audiences'; // ✅ Import utility
import priorities from '../utilities/Priorities'; // ✅ Import utility

const form_fields = {
    title: '',
    content: '',
    priority: '',
    audience: [],
    isPublished: false, // ✅ Ensure isPublished field is available
};

export default function AnnouncementForm({ onAnnouncementSaved, editData }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    // ✅ Ensure `audience` is always an array
    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                audience: Array.isArray(editData.audience)
                    ? editData.audience
                    : editData.audience
                        ? editData.audience.split(',').map((item) => item.trim())
                        : [], // ✅ Default to empty array if no audience exists
            });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Remove `id` from new announcements
        const isUpdating = Boolean(formData.id);
        const requestData = { ...formData };
        if (!isUpdating) {
            delete requestData.id; // ✅ Remove ID for new announcements
        }

        // ✅ Ensure audience is always an array
        requestData.audience = Array.isArray(formData.audience) ? formData.audience : [];

        // ✅ Ensure required fields exist
        if (!requestData.title.trim()) {
            showNotification('Title is required', 'error');
            return;
        }
        if (!requestData.content.trim()) {
            showNotification('Content is required', 'error');
            return;
        }
        if (!requestData.priority) {
            showNotification('Priority is required', 'error');
            return;
        }
        if (!requestData.audience.length) {
            showNotification('At least one audience must be selected', 'error');
            return;
        }

        // Use `author` instead of `createdBy`
        requestData.author = sessionStorage.getItem('userEmail') || 'Unknown User';

        const method = isUpdating ? 'PATCH' : 'POST';
        const url = isUpdating
            ? `${process.env.REACT_APP_API_URL}/announcement/${formData.id}`
            : `${process.env.REACT_APP_API_URL}/announcement`;

        console.log('🔹 Sending Request:', { method, url, requestData });

        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            const _response = await response.json();
            console.log('🔹 Server Response:', _response);

            if (response.ok && _response.announcement) {
                showNotification('Announcement saved successfully', 'success');
                onAnnouncementSaved();
                setFormData(form_fields); // ✅ Clear form after saving
            } else {
                showNotification(_response.message || 'Error saving announcement', 'error');
            }
        } catch (error) {
            console.error('🔹 Error saving announcement:', error);
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
                            label="Priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            {priorities.map((priority) => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Audience</InputLabel>
                        <Select
                            multiple
                            variant="outlined"
                            label="Audience"
                            value={Array.isArray(formData.audience) ? formData.audience : []} // ✅ Ensure audience is always an array
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        >
                            {audiences.map((audience) => (
                                <MenuItem key={audience} value={audience}>
                                    {audience}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ✅ Restore Published Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isPublished}
                                onChange={(e) =>
                                    setFormData({ ...formData, isPublished: e.target.checked })
                                }
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
