import { useState, useEffect } from "react";
import { Box, Typography, Skeleton, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Download } from "@mui/icons-material";
import { exportToCSV } from "../utilities/CsvExporter";



export default function TestAnnouncementData ({ refreshTrigger }) {
    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);


    const columns = [
        { field: 'isPublished', headerName: 'Published', width: 100 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'priority', headerName: 'Priority', flex: 1 },
        { field: 'audience', headerName: 'Audience', flex: 1 }
    ]

    useEffect(() => {
        const getAnnouncements = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:8005/api/announcement`)
                const _response = await response.json();

                if (response.ok && _response.announcements) {
                    console.log("Announcements API Response:", _response.announcements);
                    setRows(
                        _response.announcements.map((announcement) => ({
                        id: announcement._id,
                        isPublished: announcement.isPublished,
                        title: announcement.title,
                        priority: announcement.priority,
                            audience: announcement.audience && announcement.audience.length > 0
                                ? announcement.audience.join(", ")
                                : "N/A",
                        })))
                } else {
                    throw new Error(_response.message) || 'Failed to fetch announcements'
                }

            } catch (error) {
                console.error('Error fetching announcements', error);
                setError(error.message);
                setRows([])
            } finally {
                setIsLoading(false)
            }
        }
        getAnnouncements()
    }, [refreshTrigger])

    const handleDownloadCSV = () => {
        exportToCSV(
            rows.map(({ isPublished, title, priority, audience, content, author }) => ({
                Audience: audience,
                Author: author,
                Content: content,
                Published: isPublished,
                Priority: priority,
                Title: title
            })),
            'announcement_data'
        )
    }



    return (
        <Box sx={{ width: '80%', margin: 'auto', textAlign: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Typography variant='overline'>announcements</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
                    <IconButton onClick={handleDownloadCSV}>
                        <Download />
                    </IconButton>
                </Box>
            </Box>
            { isLoading ? (
              <Skeleton variant='rectangular' width='100%' height={400} />
            ) : (
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        sx={{
                            margin: 'auto',
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                backgroundColor: '#F9F9F9'
                            },
                            '& .MuiDataGrid-cell': {
                                padding: '8px', // Compact cell padding
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#3f51b5', // Header background color
                                color: '#000', // Header text color
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row.Mui-selected': {
                                backgroundColor: '#d3e2f7 !important', // Highlight selected rows
                            }
                        }}
                    />
                </div>
            )}
        </Box>
    )




}
