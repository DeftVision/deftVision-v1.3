import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, Alert, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Download } from "@mui/icons-material";
import { useNotification } from "../utilities/NotificationContext";

export default function ViewableDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        async function fetchDocuments() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/document`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to load documents");
                }
                setDocuments(data.documents || []);
            } catch (error) {
                setError(error.message);
                showNotification(`Error: ${error.message}`, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, []);

    // ✅ Fix: Define `handleDownload` above `columns`
    const handleDownload = async (fileKey) => {
        try {
            if (!fileKey) {
                console.error("❌ Missing fileKey for download");
                showNotification("Error: Missing file key, cannot download!", "error");
                return;
            }

            console.log("📂 Sending request to backend with fileKey:", fileKey);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/document/get-signed-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileKey: fileKey.trim() }),
            });

            const data = await response.json();
            console.log("✅ Received Signed URL:", data.presignedUrl);

            if (!response.ok || !data.presignedUrl) {
                throw new Error(data.message || "Failed to fetch signed URL");
            }

            window.open(data.presignedUrl, "_blank");
        } catch (error) {
            console.error("❌ Error downloading file:", error);
            showNotification(`Download failed: ${error.message}`, "error");
        }
    };

    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        {
            field: "fileKey",
            headerName: "Download",
            width: 140,
            renderCell: (params) => (
                params.value ? (
                    <IconButton onClick={() => handleDownload(params.value)}>
                        <Download />
                    </IconButton>
                ) : (
                    <Typography variant="body2" color="textSecondary">No File</Typography>
                )
            ),
        },
    ];

    return (
        <Box sx={{ height: 450, width: "100%", p: 2 }}>
            {loading ? (
                <Skeleton variant="rectangular" height={400} />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : documents.length > 0 ? (
                <DataGrid
                    rows={documents.map((doc) => ({
                        id: doc._id,
                        title: doc.title,
                        category: doc.category,
                        fileKey: doc.fileKey, // ✅ Make sure `fileKey` exists
                    }))}
                    columns={columns}
                    pageSize={10}
                />
            ) : (
                <Typography>No documents available</Typography>
            )}
        </Box>
    );
}
