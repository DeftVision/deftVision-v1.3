import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Skeleton,
    Modal,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Download } from '@mui/icons-material';
import { exportToCSV } from '../utilities/CsvExporter';
import priorities from '../utilities/Priorities';
import audiences from '../utilities/Audiences';

export default function AnnouncementData({ refreshTrigger }) {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [refresh, setRefresh] = useState(false); // Triggers table refresh after edit/delete

    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Unknown User' };

    useEffect(() => {
        async function getAnnouncements() {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`);
                const _response = await response.json();
                setRows(
                    _response.announcements.map((announcement) => ({
                        id: announcement._id,
                        title: announcement.title,
                        content: announcement.content,
                        priority: announcement.priority,
                        audience: announcement.audience,
                        isPublished: announcement.isPublished,
                        createdAt: announcement.createdAt
                            ? new Date(announcement.createdAt).toLocaleDateString()
                            : 'N/A',
                    }))
                );
            } catch {
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        }
        getAnnouncements();
    }, [refreshTrigger, refresh]); // Refresh when triggered

    // Export Data to CSV
    const handleDownloadCSV = () => {
        exportToCSV(rows, 'announcements');
    };

    // Open Edit Modal
    const handleEdit = (announcement) => {
        setSelectedAnnouncement({ ...announcement }); // Copy announcement data to avoid direct mutation
        setIsEditModalOpen(true);
    };

    // Close Edit Modal
    const handleCloseEditModal = () => {
        setSelectedAnnouncement(null);
        setIsEditModalOpen(false);
    };

    // Save Edited Announcement
    const handleSaveEdit = async () => {
        if (!selectedAnnouncement) return;

        try {
            const updatedAnnouncement = {
                ...selectedAnnouncement,
                author: currentUser.name, // Auto-update author
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement/${selectedAnnouncement.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAnnouncement),
            });

            if (response.ok) {
                setIsEditModalOpen(false); // Close modal after saving
                setRefresh((prev) => !prev); // Trigger table refresh
            } else {
                console.error("Failed to update announcement");
            }
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };

    // Open Delete Dialog
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    // Confirm Delete Action
    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIsDeleteDialogOpen(false);
                setRefresh((prev) => !prev); // Refresh table after delete
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    // Define Table Columns
    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'priority', headerName: 'Priority', width: 120 },
        { field: 'audience', headerName: 'Audience', flex: 1 },
        { field: 'createdAt', headerName: 'Date', width: 150 },

        // Actions Column
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEdit(params.row)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Announcements</Typography>
                <IconButton onClick={handleDownloadCSV}>
                    <Download />
                </IconButton>
            </Box>

            {/* Data Table or Skeleton */}
            {isLoading ? (
                <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    sx={{
                        backgroundColor: '#fff',
                        boxShadow: 1,
                        borderRadius: 2,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                        },
                    }}
                />
            )}

            {/* Edit Modal */}
            <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
                <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6" mb={2}>Edit Announcement</Typography>

                    {/* Title */}
                    <TextField
                        fullWidth
                        label="Title"
                        value={selectedAnnouncement?.title || ''}
                        onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    {/* Content */}
                    <TextField
                        fullWidth
                        label="Content"
                        multiline
                        rows={4}
                        value={selectedAnnouncement?.content || ''}
                        onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, content: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    {/* Priority */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            variant='outlined'
                            value={selectedAnnouncement?.priority || ''}
                            onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, priority: e.target.value })}
                        >
                            {priorities.map((priority) => (
                                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Published Switch */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={selectedAnnouncement?.isPublished || false}
                                onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, isPublished: e.target.checked })}
                            />
                        }
                        label="Published"
                    />

                    <Button onClick={handleSaveEdit} variant="contained" fullWidth>Save</Button>
                </Box>
            </Modal>
        </Box>
    );
}
