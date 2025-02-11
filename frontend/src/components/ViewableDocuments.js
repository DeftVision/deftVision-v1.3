// /components/ViewableDocuments.js (Optimized for Faster Display & Rendering)
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/document/view-docs`);
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

    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        {
            field: "downloadUrl",
            headerName: "Download",
            width: 140,
            renderCell: (params) => (
                params.value ? (
                    <IconButton href={params.value} target="_blank" rel="noopener noreferrer">
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
                        downloadUrl: doc.downloadUrl,
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