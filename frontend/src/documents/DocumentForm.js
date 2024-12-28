import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    LinearProgress,
    FormControlLabel,
    Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { useNotification } from '../utilities/NotificationContext';
import {FileUploader} from "../utilities";

const form_fields = {
    title: '',
    category: '',
    uploadedBy: '',
    file: null,
    isPublished: '',
};

export default function DocumentForm({ onDocumentCreated }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user?.firstName && user?.lastName) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                uploadedBy: `${user.firstName} ${user.lastName}`,
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData(); // Use FormData to handle file uploads
        formDataObj.append('title', formData.title);
        formDataObj.append('category', formData.category);
        formDataObj.append('uploadedBy', formData.uploadedBy);
        formDataObj.append('audiences', formData.audiences);
        formDataObj.append('file', formData.file);

        try {
            const response = await fetch('http://localhost:8005/api/document', {
                method: 'POST',
                body: formDataObj,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            });
            const result = await response.json();
            if (response.ok) {
                onDocumentCreated();
                //console.log('Document uploaded successfully:', result.document);
                showNotification(response.ok ? 'Document uploaded successfully' : 'Error uploading document', response.ok ? 'success' : 'error');
            } else {
                //console.error('Error uploading document:', result.message);
                showNotification('Error uploading document', 'error')
            }
        } catch (error) {
            showNotification('Error submitting form', 'error')
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
                            sx={{width: '500px'}}
                        />
                        <TextField
                            type="text"
                            label="Category"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            sx={{width: '500px'}}
                        />
                        <FileUploader
                            acceptedTypes={[
                                'image/jpeg',
                                'image/jpg',
                                'image/png',
                                'application/pdf',
                                'text/plain',
                                'video/mp4',
                                '.docx',
                                '.xlsx',
                            ]}
                            maxSize={5 * 1024 * 1024}
                            onFileSelect={(file) => setFormData({...formData, file })}
                            onProgressUpdate={(progress) => console.log('Upload progress:', progress)}
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
