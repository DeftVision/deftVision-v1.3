import { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function SupportData({ refreshTrigger }) {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        {field: "subject", headerName: "Subject", flex: 1},
        {field: "ticketStatus", headerName: "Ticket Status", flex: 1},
        {field: "dateSubmitted", headerName: "Date Submitted", width: 180},
    ];


    useEffect(() => {
        const fetchSupportTickets = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8005/api/support/user-tickets', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                }
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
                    throw new Error(_response.message || 'Failed to fetch ticket');
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setError(error.message);
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSupportTickets()
    }, [refreshTrigger]);

    return (
      <Box sx={{ width: '80%', margin: 'auto', textAlign: 'center', padding: 2}}>
          {isLoading ? (
             <div>
                 <Skeleton variant='rectangular' width='100%' height={400} />
             </div>
          ) : (
              <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      sx={{
                          '& .MuiDataGrid-root': {
                              border: 'none',
                              backgroundColor: '#f9f9f9',
                          },
                          '& .MultiGrid-columnHeaders': {
                              backgroundColor: "#3f51b5",
                              color: "#000",
                              fontWeight: "bold",
                          },
                          '& .MultiGrid-row.Mui-selected': {
                              backgroundColor: '#d3e2f7 !important',
                          }
                      }}
                  />
              </div>
          )}
      </Box>
    );
}