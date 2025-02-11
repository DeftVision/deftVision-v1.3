// /components/FileUploader.js (Optimized for Direct S3 Uploads)
import React, { useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNotification } from '../utilities/NotificationContext';

export default function FileUploader({ onFileSelect }) {
    const { showNotification } = useNotification();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];

        setUploading(true);
        setUploadProgress(0);
        onFileSelect(file);

        try {
            // 🔹 Get Pre-Signed URL from Backend
            const presignedResponse = await fetch(`${process.env.REACT_APP_API_URL}/document/presigned-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            });

            const { presignedUrl, fileKey } = await presignedResponse.json();
            if (!presignedUrl) throw new Error("Failed to get upload URL");

            // 🔹 Upload File to S3
            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!uploadResponse.ok) throw new Error("Failed to upload file");

            showNotification(`${file.name} uploaded successfully`, "success");
            setUploadProgress(100);
            onFileSelect({ fileKey }); // ✅ Send file key back to parent
        } catch (error) {
            showNotification(`Upload failed: ${error.message}`, "error");
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xls", ".xlsx"],
            "text/plain": [".txt"],
            "video/mp4": [".mp4"]
        },
        maxSize: 10 * 1024 * 1024, // 10MB Limit
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

            {/* ✅ Display Upload Progress */}
            {uploading && (
                <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ width: '100%', marginTop: 2 }}
                />
            )}
        </Box>
    );
}
