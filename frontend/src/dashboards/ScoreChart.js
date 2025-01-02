import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from "react";
import { useNotification } from '../utilities/NotificationContext';
import { Box } from "@mui/material";

export default function ScoreChart({ scoreType, label }) {
    const [series, setSeries] = useState([0]);
    const { showNotification } = useNotification();

    const options = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%', // Determines the inner circle size
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: '12px',
                        offsetY: -10,
                        color: '#333',
                    },
                    value: {
                        show: true,
                        fontSize: '20px',
                        offsetY: 10, // Keeps percentage slightly below the label
                        color: '#000',
                        fontWeight: 'bold',
                    },
                },
                track: {
                    show: true,
                    background: '#f0f0f0',
                    strokeWidth: '97%',
                    margin: 5,
                },
            },
        },
        labels: [label], // Data label displayed in the center
        colors: ['#1E90FF'], // Consistent color for the radial bars
    };

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

    const calculateCollectiveScore = (scores) => {
        const totalEntries = scores.length;
        const sumOfScores = scores.reduce((sum, item) => sum + (item.score || 0), 0);
        const maxScore = 10;
        const percentage = totalEntries > 0 ? (sumOfScores / (maxScore * totalEntries)) * 100 : 0;

        setSeries([Number(percentage.toFixed(2))]); // Update chart data
    };

    return (
        <Box
            sx={{
                width: 250,
                height: 250,
                textAlign: 'center',
                margin: 'auto',
                marginBottom: 20,
            }}
        >
            <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={250}
            />
        </Box>
    );
}
