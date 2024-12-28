import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    LinearProgress,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { useNotification } from '../utilities/NotificationContext';

const form_fields = {
    title: '',
    category: '',
    uploadedBy: '',
    file: null,
    isPublished: false,
};

export default function DocumentForm({ onDocumentCreated }) {
    const [formData, setFormData] = useState(form_fields);
    const [uploadProgress, setUploadProgress] = useState(0);
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

    const handleDrop = (acceptedFiles, rejectedFiles) => {
        if(rejectedFiles > 0) {
            showNotification('unsupported file type or file size too large', 'error');
            return;
        }

        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFormData({ ...formData, file });
            showNotification(`${file.name} added successfully`, 'success')
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'video/mp4', '.docx', 'xlsx', '.ppt', 'pptx'],
        maxSize: 5 * 1024 * 1024, // 5 MB limit
    })







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
                    setUploadProgress(progress);
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
                        <div
                            { ...getRootProps() }
                            style={{
                                border: '2px dashed gray',
                                borderRadius: '5px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                selfAlign: 'center'
                            }}
                        >
                            <input { ...getInputProps()} />
                            {isDragActive ? (
                                <Typography>Drop the file here</Typography>
                            ) : (
                                <Typography>
                                    Drag & drop a file here, or click to select one
                                </Typography>
                            )}
                        </div>
                        {formData.file && (
                            <Typography>Selected file: {formData.file.name}</Typography>
                        )}
                        {uploadProgress > 0 && (
                            <LinearProgress
                                variant='determinate'
                                value={uploadProgress}
                                sx={{ width: '500px' }}
                            />
                        )}
                        {/*<input
                            type="hidden"
                            value={formData.uploadedBy}
                            onChange={(e) =>
                                setFormData({ ...formData, uploadedBy: e.target.value })
                            }
                        />
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,.txt,.mp4,.docx,.xlsx"
                            onChange={(e) =>
                                setFormData({ ...formData, file: e.target.files[0] })
                            }
                        />*/}
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
