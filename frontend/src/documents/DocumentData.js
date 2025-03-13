import React, { useState, useEffect } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    CircularProgress,
    FormControl,
    OutlinedInput,
    InputAdornment,
} from "@mui/material";
import { Delete, Download, Edit, Search } from "@mui/icons-material";
import { useNotification } from "../utilities/NotificationContext";

export default function DocumentData({ refreshTrigger, onEditDocument }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const { showNotification } = useNotification();

    useEffect(() => {
        async function fetchDocuments() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/document`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Documents Fetched:", data.documents);
                    setDocuments(data.documents || []);
                } else {
                    showNotification("Error fetching documents", "error");
                }
            } catch (error) {
                showNotification("Failed to load documents", "error");
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/document/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setDocuments((prev) => prev.filter((doc) => doc._id !== id));
                showNotification("Document deleted successfully", "success");
            } else {
                showNotification("Failed to delete document", "error");
            }
        } catch (error) {
            showNotification("Error deleting document", "error");
        } finally {
            setDeleting(null);
        }
    };

    const handleDownload = async (fileKey) => {
        try {
            if (!fileKey) {
                console.error("Missing fileKey for download");
                showNotification("Error: Missing file key, cannot download!", "error");
                return;
            }

            console.log("Sending request to backend with fileKey:", fileKey);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/document/get-signed-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileKey: fileKey.trim() }),
            });

            const data = await response.json();
            console.log("Received Signed URL:", data.presignedUrl);

            if (!response.ok || !data.presignedUrl) {
                throw new Error(data.message || "Failed to fetch signed URL");
            }

            window.open(data.presignedUrl, "_blank");  // Open the file in a new tab
        } catch (error) {
            console.error("Error downloading file:", error);
            showNotification(`Download failed: ${error.message}`, "error");
        }
    };


    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <OutlinedInput
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </FormControl>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Published</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents
                            .filter((doc) =>
                                doc.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((doc) => (
                                <TableRow key={doc._id}>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>{doc.category}</TableCell>
                                    <TableCell>{doc.isPublished ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDownload(doc.fileKey)}>
                                            <Download />
                                        </IconButton>
                                        <IconButton onClick={() => onEditDocument(doc)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(doc._id)}
                                            disabled={deleting === doc._id}
                                        >
                                            {deleting === doc._id ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                <Delete />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={documents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
            />
        </Box>
    );
}
