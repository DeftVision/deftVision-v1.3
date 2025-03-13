import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Skeleton, OutlinedInput, InputAdornment } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Edit } from '@mui/icons-material';

export default function AnnouncementData({ refreshTrigger, onEditAnnouncement }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function getAnnouncements() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/announcement`);
                const _response = await response.json();
                if (response.ok && _response.announcements) {
                    setAnnouncements(
                        _response.announcements.map((announcement) => ({
                            id: announcement._id,
                            title: announcement.title,
                            content: announcement.content,
                            priority: announcement.priority,
                            audience: announcement.audience.join(', '),
                            isPublished: announcement.isPublished,
                        }))
                    );
                } else {
                    console.error('Failed to fetch announcements');
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        }
        getAnnouncements();
    }, [refreshTrigger]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredAnnouncements = announcements.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'content', headerName: 'Content', flex: 2 },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 120,
        },
        {
            field: 'audience',
            headerName: 'Audience',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <IconButton onClick={() => onEditAnnouncement(params.row)}>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Announcements</Typography>
                <OutlinedInput
                    id="search-announcements"
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search announcements"
                    sx={{ width: 250 }}
                />
            </Box>

            {loading ? (
                <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
            ) : (
                <DataGrid
                    rows={filteredAnnouncements}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                            backgroundColor: (theme) => theme.palette.background.default,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.background.paper
                                    : theme.palette.grey[200],
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: (theme) => theme.palette.action.selected,
                            color: (theme) =>
                                theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'inherit',
                        },
                        '& .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: (theme) => theme.palette.action.hover,
                        },
                        '& .MuiDataGrid-cell': {
                            color: (theme) => theme.palette.text.primary,
                        },
                    }}
                />
            )}
        </Box>
    );
}
