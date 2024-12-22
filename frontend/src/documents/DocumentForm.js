import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useState } from 'react';

const form_fields = {
    title: '',
    category: '',
    uploadedBy: '',
    access: '',
    file: null, // New file field
};

export default function DocumentForm({ onDocumentCreated }) {
    const [formData, setFormData] = useState(form_fields);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData(); // Use FormData to handle file uploads
        formDataObj.append('title', formData.title);
        formDataObj.append('category', formData.category);
        formDataObj.append('uploadedBy', formData.uploadedBy);
        formDataObj.append('access', formData.access);
        formDataObj.append('file', formData.file);

        try {
            const response = await fetch('http://localhost:8005/api/document', {
                method: 'POST',
                body: formDataObj, // Pass FormData directly
            });
            const result = await response.json();
            if (response.ok) {
                onDocumentCreated();
                console.log('Document uploaded successfully:', result.document);
            } else {
                console.error('Error uploading document:', result.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box width="100%" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            <Box sx={{ width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5 }}>
                <form onSubmit={handleSubmit}>
                    <Stack direction="column" spacing={3}>
                        <TextField
                            type="text"
                            label="Title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                        <TextField
                            type="text"
                            label="Category"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                        />
                        <TextField
                            type="text"
                            label="Uploaded By"
                            value={formData.uploadedBy}
                            onChange={(e) =>
                                setFormData({ ...formData, uploadedBy: e.target.value })
                            }
                        />
                        <TextField
                            type="text"
                            label="Access"
                            value={formData.access}
                            onChange={(e) =>
                                setFormData({ ...formData, access: e.target.value })
                            }
                        />
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,.txt,.mp4,.docx,.xlsx"
                            onChange={(e) =>
                                setFormData({ ...formData, file: e.target.files[0] })
                            }
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="publish"
                                    checked={formData.isPublished}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isPublished: e.target.checked })
                                    }
                                />
                            }
                            label="Publish"
                        />
                        <Button variant="outlined" type="submit">
                            Save
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
}
