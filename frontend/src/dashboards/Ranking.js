import {Box, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'




export default function ranking () {
    const columns = [
        { field: 'rank', headerName: 'Rank', width: 100 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'finalScore', headerName: 'Final Score', width: 150 }
    ];

    const rows = [
        { id: 1, rank: 1, location: 'Location A', finalScore: 95},
        { id: 2, rank: 2, location: 'Location B', finalScore: 88},
        { id: 3, rank: 3, location: 'Location C', finalScore: 75}
    ]

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={3} sx={{ margin: 'auto', marginBottom: 50 }} />
        </div>
    );
};