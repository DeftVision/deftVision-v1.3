import { useState, useEffect } from "react";
import {Box, Typography, Select, MenuItem, Skeleton, IconButton} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { Download } from '@mui/icons-material';
import {exportToCSV} from "../utilities/CsvExporter";

const scoreTypes = [
    { type: 'foodScore', label: 'Food Score' },
    { type: 'serviceScore', label: 'Service Score' },
    { type: 'cleanScore', label: 'Cleanliness Score' },
    { type: 'finalScore', label: 'Final Score' }
]


export default function Ranking () {
    const [rows, setRows] = useState([]);
    const [selectedScoreType, setSelectedScoreType] = useState('finalScore');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'rank', headerName: 'Rank', width: 100 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'score', headerName: `${scoreTypes.find(s => s.type === selectedScoreType)?.label}`, width: 150 },
    ];


    useEffect(() => {
        const getRankings= async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:8005/api/shopper/scores?type=${selectedScoreType}`)
                const _response = await response.json();

                if (response.ok && _response.scores) {
                    setRows(_response.scores.map((score) => ({
                        id: score.rank, // Ensure each row has a unique `id`
                        rank: score.rank,
                        location: score.location,
                        score: score.score,
                    })));
                } else {
                    throw new Error(_response.message || 'Failed to fetch scores');
                }
            } catch (err) {
                console.error('Error fetching rankings:', err);
                setError(err.message);
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        }
        getRankings();
    }, [selectedScoreType]);

    const handleDownloadCSV = () => {
        exportToCSV(
            rows.map(({ rank, location, score }) => ({
                Rank: rank,
                Location: location,
                Score: score,
            })),
            'store_rankings'
        );
    };

    return (
        <Box sx={{ width: '80%', margin: 'auto', textAlign: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Typography variant="h6">Store Rankings</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select
                        variant='outlined'
                        value={selectedScoreType}
                        onChange={(e) => setSelectedScoreType(e.target.value)}
                        size="small"
                        sx={{ height: 40 }}
                    >
                        <MenuItem value="foodScore">Food Score</MenuItem>
                        <MenuItem value="serviceScore">Service Score</MenuItem>
                        <MenuItem value="cleanScore">Cleanliness Score</MenuItem>
                        <MenuItem value="finalScore">Final Score</MenuItem>
                    </Select>

                    <IconButton onClick={handleDownloadCSV} title="Download CSV">
                        <Download />
                    </IconButton>
                </Box>
            </Box>

            {error && <Typography color="error">{error}</Typography>}

            {isLoading ? (
                <Typography>Loading...</Typography>
            ) : (
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        sx={{
                            margin: 'auto',
                            '& .MuiDataGrid-root': {
                                border: 'none', // Removes the default border
                                backgroundColor: '#f9f9f9', // Light background
                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: '#f5f5f5', // Alternate row color
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
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#eaf4fe', // Hover color
                            },
                        }}
                    />
                </div>
            )}
        </Box>
    );
};