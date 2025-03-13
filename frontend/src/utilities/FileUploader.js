// /utilities/FileUploader.js (Fixed: Upload Only on Submit)
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFileSelect }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        console.log("File selected but not uploaded yet:", file.name);
        setSelectedFile(file); // Store file but do not upload
        onFileSelect(file); // Send file to parent component (DocumentForm.js)
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

            {/* ✅ Display selected file */}
            {selectedFile && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Selected File: {selectedFile.name}
                </Typography>
            )}
        </Box>
    );
}
