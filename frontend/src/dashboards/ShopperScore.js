// /components/ShopperScore.js
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton, Box, Select, MenuItem } from '@mui/material';
import { dashboardLocations } from '../utilities/OtherLocations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ShopperScore() {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState('All');

    useEffect(() => {
        const fetchShopperScores = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/shopper/scores');
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const _response = await response.json();
                setChartData(formatChartData(_response.scores, 'All'));
            } catch (error) {
                console.error('Error fetching shopper scores:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShopperScores();
    }, []);

    const formatChartData = (scores, filterLocation) => {
        const filteredScores = filterLocation === 'All'
            ? scores
            : scores.filter((score) => score.location === filterLocation);

        return {
            labels: filteredScores.map((score) => score.location),
            datasets: [
                {
                    label: 'Scores',
                    data: filteredScores.map((score) => score.score),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const handleLocationChange = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);
        const scores = chartData.datasets[0]?.data.map((value, index) => ({
            location: chartData.labels[index],
            score: value,
        }));
        setChartData(formatChartData(scores, location));
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Shopper Scores (${selectedLocation})` },
        },
    };

    if (isLoading) {
        return (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Skeleton variant="text" width={200} sx={{ margin: 'auto', fontSize: '1.5rem' }} />
                <Skeleton variant="rectangular" width="100%" height={300} />
            </Box>
        );
    }

    return (
        <Box sx={{ px: 2, py: 4 }}>
            <Select
                variant="outlined"
                value={selectedLocation}
                onChange={handleLocationChange}
                sx={{ marginBottom: 2 }}
                fullWidth
            >
                <MenuItem value="All">All</MenuItem>
                {dashboardLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                        {location}
                    </MenuItem>
                ))}
            </Select>
            <Bar data={chartData} options={options} />
        </Box>
    );
}
