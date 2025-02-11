// /components/DocumentData.js (Optimized for Faster Rendering)
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
    Button,
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/document/view-docs`);
                const data = await response.json();
                if (response.ok) {
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
                                    <TableCell>
                                        <IconButton
                                            onClick={() => window.open(doc.downloadUrl, "_blank")}
                                        >
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
