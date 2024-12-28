import React, { useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNotification } from '../utilities/NotificationContext';

export default function FileUploader({
                                         acceptedTypes = [],
                                         maxSize = 5 * 1024 * 1024, // Default: 5 MB
                                         onFileSelect,
                                     }) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const { showNotification } = useNotification();

    const handleDrop = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            showNotification('Unsupported file type or file size too large', 'error');
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onFileSelect(file); // Notify parent of the selected file
            setUploadProgress(0);
            showNotification(`${file.name} added successfully`, 'success');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: acceptedTypes,
        maxSize,
    });

    return (
        <Box>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed gray',
                    borderRadius: '5px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <Typography>Drop the file here...</Typography>
                ) : (
                    <Typography>Drag & drop a file here, or click to select one</Typography>
                )}
            </div>
            {uploadProgress > 0 && (
                <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ width: '100%', marginTop: 2 }}
                />
            )}
        </Box>
    );
}
