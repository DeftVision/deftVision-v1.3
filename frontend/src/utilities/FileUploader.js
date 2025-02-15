// /components/FileUploader.js (Optimized for Direct S3 Uploads)
import React, { useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNotification } from "../utilities/NotificationContext";

export default function FileUploader({ onFileSelect }) {
    const { showNotification } = useNotification();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleDrop = async (acceptedFiles) => {
        try {
            const file = acceptedFiles[0];
            if (!file) return;

            console.log("📂 Uploading File:", file.name);

            // ✅ Request a presigned URL from the backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/document/presigned-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to get presigned URL: ${errorData.message}`);
            }

            const { presignedUrl, fileKey } = await response.json();
            console.log("✅ Received Presigned URL:", presignedUrl);

            // ✅ Upload file directly to S3
            const s3Upload = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!s3Upload.ok) throw new Error("Failed to upload file to S3");

            console.log("✅ File successfully uploaded to S3");

            // ✅ Notify DocumentForm.js that fileKey is available
            if (onFileSelect) {
                console.log("📌 Passing fileKey to DocumentForm:", fileKey);
                onFileSelect(fileKey); // 🔥 This is the key fix
            }

            // ✅ Save metadata in MongoDB
            const saveResponse = await fetch(`${process.env.REACT_APP_API_URL}/document/metadata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: file.name,
                    category: "General",
                    fileKey,
                    uploadedBy: "user123",
                    isPublished: false,
                }),
            });

            if (!saveResponse.ok) throw new Error("Failed to save metadata");

            console.log("✅ File metadata saved in database");

        } catch (error) {
            console.error("❌ Upload error:", error);
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
            "video/mp4": [".mp4"],
        },
        maxSize: 10 * 1024 * 1024, // 10MB Limit
    });

    return (
        <Box>
            <div
                {...getRootProps()}
                style={{
                    border: "2px dashed gray",
                    borderRadius: "5px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
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
                    sx={{ width: "100%", marginTop: 2 }}
                />
            )}
        </Box>
    );
}
