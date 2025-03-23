// /components/DocumentForm.js
import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    LinearProgress,
    FormControlLabel,
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
            // Step 1: Get Presigned URL
            const { presignedUrl, fileKey: uploadedFileKey } = await getPresignedUploadUrl(selectedFile);

            // Step 2: Upload file to S3
            const s3UploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                headers: { "Content-Type": selectedFile.type },
                body: selectedFile,
            });

            if (!s3UploadResponse.ok) {
                throw new Error("Failed to upload file to S3");
            }

            setFileKey(uploadedFileKey);

            // Step 3: Submit metadata to backend
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
            setSelectedFile(null);
            setFileKey(null);
        } catch (error) {
            console.error("Submit Error:", error);
            showNotification(`Failed to save document: ${error.message}`, "error");
        } finally {
            setUploading(false);
        }
    };

    const getPresignedUploadUrl = async (file) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/document/get-presigned-upload-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, fileType: file.type }),
        });

        const { presignedUrl, fileKey } = await response.json();
        if (!presignedUrl || !fileKey) {
            throw new Error("Invalid presigned URL or file key");
        }

        return { presignedUrl, fileKey };
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

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                        }
                        label="Published"
                    />

                    {uploading && (
                        <LinearProgress
                            variant="indeterminate"
                            sx={{ width: "100%" }}
                        />
                    )}

                    <Button type="submit" variant="contained" disabled={uploading}>
                        Submit
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
