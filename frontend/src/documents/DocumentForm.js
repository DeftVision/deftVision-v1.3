// /components/DocumentForm.js (Optimized for Direct S3 Uploads)
import {
    Box,
    Button,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
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
    const [fileKey, setFileKey] = useState(null);
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

    useEffect(() => {
        console.log("Updated FileKey in State:", fileKey); // Debugging
    }, [fileKey]); //Now correctly tracks changes to fileKey

    const handleFileUpload = (newFileKey) => {
        console.log("📂 Received FileKey from FileUploader:", newFileKey);

        if (!newFileKey) {
            console.error("❌ Error: FileKey is undefined or null");
            return;
        }

        setFileKey(newFileKey);
        console.log("✅ FileKey successfully updated in state:", newFileKey);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🚨 FileKey Before Submission:", fileKey); // Debugging

        if (!fileKey || fileKey.trim() === "") {
            showNotification("Please upload a file before submitting", "error");
            return;
        }

        setUploading(true);

        const requestData = {
            title: formData.title.trim(),
            category: formData.category.trim(),
            fileKey,
            uploadedBy: sessionStorage.getItem("userEmail") || "Unknown User",
            isPublished: formData.isPublished || false,
        };

        try {
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

            showNotification("Document saved successfully", "success");
            setFormData(initialForm);
            setFileKey(null);
            setUploading(false);

            if (onDocumentUpdated) {
                onDocumentUpdated();
            }
        } catch (error) {
            showNotification(`Failed to save document: ${error.message}`, "error");
            setUploading(false);
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

                    <FileUploader onFileSelect={handleFileUpload} />

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
                    <Button type="submit" variant="contained" disabled={uploading}>
                        {uploading ? "Saving..." : editData ? "Update Document" : "Save Document"}
                    </Button>
                    {uploading && <LinearProgress sx={{ width: "100%" }} />}
                </Stack>
            </form>
        </Box>
    );
}
