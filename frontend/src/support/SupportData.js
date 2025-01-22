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

    useEffect(() => {
        const fetchSupportTickets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8005/api/support/user-tickets', {
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
                                backgroundColor: '#f9f9f9',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#3f51b5',
                                color: '#fff',
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row.Mui-selected': {
                                backgroundColor: '#d3e2f7 !important',
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
