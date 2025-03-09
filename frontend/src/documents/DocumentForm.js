// /components/DocumentForm.js (Updated with consistent async/await)
import {
    Box,
    Button,
    TextField,
    Stack,
    LinearProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import FileUploader from "../utilities/FileUploader";
import { useNotification } from "../utilities/NotificationContext";

const initialForm = {
    title: "",
    category: "",
    isPublished: false,
};

export default function DocumentForm({ onDocumentUpdated, editData }) {
    const [formData, setFormData] = useState(initialForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileKey, setFileKey] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                category: editData.category || "",
                isPublished: editData.isPublished || false,
            });
            setFileKey(editData.fileKey || null);
        }
    }, [editData]);

    const handleFileSelection = (file) => {
        console.log("File selected:", file.name);
        setSelectedFile(file);
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            showNotification("Please select a file before submitting", "error");
            return;
        }

        setUploading(true);

        try {
            // Step 1: Upload file to S3 and get fileKey
            const uploadedFileKey = await uploadFileToS3(selectedFile);
            if (!uploadedFileKey) {
                throw new Error("File upload failed");
            }
            setFileKey(uploadedFileKey);

            // Step 2: Submit form data after successful upload
            const requestData = {
                title: formData.title.trim(),
                category: formData.category.trim(),
                fileKey: uploadedFileKey,
                uploadedBy: sessionStorage.getItem("userEmail") || "Unknown User",
                isPublished: formData.isPublished || false,
            };

            const method = editData ? "PATCH" : "POST";
            const url = editData
                ? `${process.env.REACT_APP_API_URL}/document/${editData._id}`
                : `${process.env.REACT_APP_API_URL}/document/metadata`;

            console.log("📡 Sending form data to:", url, requestData);

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to save document");
            }

            showNotification("Document saved successfully!", "success");
            setFormData(initialForm);
            setFileKey(null);
            setSelectedFile(null);
            setUploading(false);

            if (onDocumentUpdated) {
                onDocumentUpdated();
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            showNotification(`Failed to save document: ${error.message}`, "error");
            setUploading(false);
        }
    };

    const uploadFileToS3 = async (file) => {
        try {
            // Request presigned URL from backend
            console.log("Requesting presigned URL for file:", file.name);
            const presignedResponse = await fetch(`${process.env.REACT_APP_API_URL}/document/get-presigned-upload-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
            });

            const presignedData = await presignedResponse.json();
            if (!presignedResponse.ok) {
                throw new Error(presignedData.message || "Failed to get presigned URL");
            }

            console.log("Presigned URL received:", presignedData.presignedUrl);

            // Upload file to S3
            const response = await fetch(presignedData.presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            console.log("File uploaded successfully!");
            return presignedData.fileKey;
        } catch (error) {
            console.error("Upload Error:", error);
            throw error;
        }
    };

    return (
        <Box sx={{ width: "100%", px: 2, mb: 4 }}>
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

                    <FileUploader onFileSelect={handleFileSelection} />

                    {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: "100%" }} />}

                    <Button type="submit" variant="contained" disabled={uploading}>
                        Submit
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

