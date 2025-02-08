import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Download } from '@mui/icons-material';
import { exportToCSV } from '../utilities/CsvExporter';

export default function AnnouncementData({ refreshTrigger }) {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                        author: announcement.author,
                        priority: announcement.priority,
                        audience: announcement.audience.join(', '),
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
    }, [refreshTrigger]);

    // Export Data to CSV
    const handleDownloadCSV = () => {
        exportToCSV(rows, 'announcements');
    };

    // Handle Edit Action
    const handleEdit = (id) => {
        console.log(`Edit announcement ID: ${id}`);
        // TODO: Implement Edit Functionality
    };

    // Handle Delete Action
    const handleDelete = (id) => {
        console.log(`Delete announcement ID: ${id}`);
        // TODO: Implement Delete Functionality
    };

    // Define Table Columns
    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'author', headerName: 'Author', flex: 1 },
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
                    <IconButton onClick={() => handleEdit(params.row.id)} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="error">
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
                        width: '100%',       // Ensures full width inside container
                        minWidth: '800px',   // Prevents being too narrow
                        maxWidth: '100%',    // Prevents overflow
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
        </Box>
    );
}
