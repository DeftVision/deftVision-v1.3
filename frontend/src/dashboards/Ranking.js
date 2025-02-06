// /components/Ranking.js
import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Skeleton, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Download } from '@mui/icons-material';
import { exportToCSV } from '../utilities/CsvExporter';

export default function Ranking() {
    const [rows, setRows] = useState([]);
    const [selectedScoreType, setSelectedScoreType] = useState('finalScore');
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { field: 'rank', headerName: 'Rank', width: 100 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'score', headerName: 'Score', flex: 1 },
    ];

    useEffect(() => {
        async function getRankings() {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/shopper/scores?type=${selectedScoreType}`);
                const _response = await response.json();
                setRows(
                    _response.scores.map((score) => ({
                        id: score.rank,
                        rank: score.rank,
                        location: score.location,
                        score: score.score,
                    }))
                );
            } catch {
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        }
        getRankings();
    }, [selectedScoreType]);

    const handleDownloadCSV = () => {
        exportToCSV(rows, 'store_rankings');
    };

    return (
        <Box sx={{ px: 2, py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="overline">Store Rankings</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Select
                        variant='outlined'
                        value={selectedScoreType}
                        onChange={(e) => setSelectedScoreType(e.target.value)}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="foodScore">Food Score</MenuItem>
                        <MenuItem value="serviceScore">Service Score</MenuItem>
                        <MenuItem value="cleanScore">Cleanliness Score</MenuItem>
                        <MenuItem value="finalScore">Final Score</MenuItem>
                    </Select>
                    <IconButton onClick={handleDownloadCSV}>
                        <Download />
                    </IconButton>
                </Box>
            </Box>
            {isLoading ? (
                <Skeleton variant="rectangular" height={400} />
            ) : (
                <DataGrid rows={rows} columns={columns} pageSize={10} sx={{ height: 400, backgroundColor: '#f9f9f9' }} />
            )}
        </Box>
    );
}
