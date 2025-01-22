// /components/DocumentForm.js
import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';

const initialForm = {
    title: '',
    category: '',
    isPublished: false,
};

export default function DocumentForm({ onDocumentCreated }) {
    const [formData, setFormData] = useState(initialForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) onDocumentCreated();
    };

    return (
        <Box sx={{ width: '100%', px: 2, mb: 4 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isPublished}
                                onChange={(e) =>
                                    setFormData({ ...formData, isPublished: e.target.checked })
                                }
                            />
                        }
                        label="Publish"
                    />
                    <Button type="submit" variant="contained">
                        Save Document
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
