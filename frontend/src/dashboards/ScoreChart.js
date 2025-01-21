// /components/ScoreChart.js
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import { Box } from '@mui/material';

export default function ScoreChart({ scoreType, label }) {
    const [series, setSeries] = useState([0]);
    const { showNotification } = useNotification();

    const options = {
        chart: { type: 'radialBar' },
        plotOptions: {
            radialBar: {
                hollow: { size: '60%' },
                dataLabels: {
                    name: { show: true, fontSize: '12px', offsetY: -10 },
                    value: { show: true, fontSize: '20px', offsetY: 10, fontWeight: 'bold' },
                },
            },
        },
        labels: [label],
        colors: ['#1E90FF'],
    };

    useEffect(() => {
        async function fetchScores() {
            try {
                const response = await fetch(`http://localhost:8000/api/shopper/scores?type=${scoreType}`);
                const data = await response.json();
                if (response.ok && data.scores) calculateCollectiveScore(data.scores);
                else showNotification(`Failed to load ${label} scores`, 'error');
            } catch (error) {
                console.error(`Error loading ${label} scores:`, error);
                showNotification(`Error loading ${label} scores`, 'error');
            }
        }
        fetchScores();
    }, [scoreType]);

    const calculateCollectiveScore = (scores) => {
        const totalEntries = scores.length;
        const percentage = totalEntries > 0
            ? (scores.reduce((sum, item) => sum + (item.score || 0), 0) / (10 * totalEntries)) * 100
            : 0;
        setSeries([Number(percentage.toFixed(2))]);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto', mb: 4 }}>
            <ReactApexChart options={options} series={series} type="radialBar" height={250} />
        </Box>
    );
}
