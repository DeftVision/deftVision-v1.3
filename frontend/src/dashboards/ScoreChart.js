import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from "react";
import { useNotification } from '../utilities/NotificationContext'
import { Box } from "@mui/material";


export default function ScoreChart ({ scoreType, label }) {
    const [series, setSeries] = useState([0])
    const { showNotification } = useNotification()


    const options = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: { size: '60%' },
                dataLabels: {
                    name: { fontSize: '16px', color: '#333' },
                    value: { fontSize: '24px', color: '#333' }
                },
            },
        },
        labels: [label]
    }

    useEffect(() => {
        async function fetchScores() {
            try {
                const response = await fetch(`http://localhost:8005/api/shopper/scores?type=${scoreType}`);
                const data = await response.json();

                if (response.ok && data.scores) {
                    calculateCollectiveScore(data.scores);
                } else {
                    showNotification(`Failed to load ${label} scores`, 'error');
                }
            } catch (error) {
                console.error(`Error loading ${label} scores:`, error);
                showNotification(`Error loading ${label} scores`, 'error');
            }
        }

        fetchScores();
    }, [scoreType]);

    //calculate collective scores
    const calculateCollectiveScore = (scores) => {
        const totalEntries = scores.length;
        const sumOfScores = scores.reduce((sum, item) => sum + (item.score || 0), 0);
        const maxScore = 10;
        const percentage = totalEntries > 0 ? (sumOfScores / (maxScore * totalEntries)) * 100 : 0;

        setSeries([Number(percentage.toFixed(2))]); // Update chart data
    };

    return (
        <Box sx={{ textAlign: 'center', margin: 'auto', marginBottom: 20 }}>
            <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={250}
            />
        </Box>
    );
};

