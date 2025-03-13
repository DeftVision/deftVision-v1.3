// /components/SupportData.js
import { useState, useEffect } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function SupportData({ refreshTrigger }) {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'subject', headerName: 'Subject', flex: 1 },
        { field: 'ticketStatus', headerName: 'Ticket Status', flex: 1 },
        { field: 'dateSubmitted', headerName: 'Date Submitted', width: 180 },
    ];

    // what part of the code in this component controls the colors when in light and dark mode?
    useEffect(() => {
        const fetchSupportTickets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/support/user-tickets`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                const _response = await response.json();

                if (response.ok && _response.tickets) {
                    setRows(
                        _response.tickets.map((ticket) => ({
                            id: ticket._id,
                            subject: ticket.subject,
                            ticketStatus: ticket.ticketStatus,
                            dateSubmitted: new Date(ticket.dateTime).toLocaleString(),
                        }))
                    );
                } else {
                    throw new Error(_response.message || 'Failed to fetch tickets');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setError(error.message);
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSupportTickets();
    }, [refreshTrigger]);

    return (
        <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
            {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={400} />
            ) : (
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                backgroundColor: (theme) => theme.palette.background.default,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.background.paper // Dark mode header background
                                        : theme.palette.grey[200], // Light mode header background
                                color: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.text.primary // Dark mode header text
                                        : theme.palette.text.primary, // Light mode header text
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row.Mui-selected': {
                                backgroundColor: (theme) => theme.palette.action.selected,
                                color: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.text.secondary // Dark text for selected row in dark mode
                                        : 'inherit', // Keep default for light mode
                            },
                            '& .MuiDataGrid-row.Mui-selected:hover': {
                                backgroundColor: (theme) => theme.palette.action.hover, // Adjust hover state
                            },
                            '& .MuiDataGrid-cell': {
                                color: (theme) => theme.palette.text.primary, // Default text color for all rows
                            },
                        }}
                    />
                </Box>
            )}
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
}
