import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton, Box, Select, MenuItem } from '@mui/material'
import { dashboardLocations } from '../utilities/OtherLocations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ShopperScore() {
    const [chartData, setChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState('All')

    useEffect(() => {
        const fetchShopperScores = async () => {
        try {
            const response = await fetch('http://localhost:8005/api/shopper/scores')
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const _response = await response.json()

            const formattedData = formatChartData(_response.scores, 'All');
            setChartData(formattedData)
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }
        fetchShopperScores();
    }, [])



    const formatChartData = (scores, filterLocation) => {
        if (!Array.isArray(scores)) {
            console.error('Scores must be an array:', scores);
            return {
                labels: [],
                datasets: [],
            };
        }

        const filteredScores = filterLocation === 'All'
            ? scores
            : scores.filter((score) => score.location === filterLocation);

        return {
            labels: filteredScores.map((score) => score.location),
            datasets: [
                {
                    label: 'Scores',
                    data: filteredScores.map((score) => score.score),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Consistent theme
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };


        const handleLocationChange = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);

        if (!chartData || !chartData.labels) {
            console.error('No chart data available to filter.');
            return;
        }

        const scores = chartData.datasets[0]?.data.map((value, index) => ({
            location: chartData.labels[index],
            score: value,
        }));

        // Update chart data for the selected location
        const filteredData = formatChartData(scores, location);
        setChartData(filteredData);
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Shopper Scores (${selectedLocation}`,
            },
        },
    };

    if (isLoading) {
        return (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Skeleton variant='text' width={200} sx={{ margin: 'auto', fontSize: '1.5rem'}} />
                <Skeleton variant='rectangular' width='100%' height={300} />
            </Box>
        );
    }

    return (
        <Box>
            <Select
                variant='outlined'
                value={selectedLocation}
                onChange={handleLocationChange}
                sx={{ marginBottom: 2 }}
            >
                <MenuItem value="Locations">Locations</MenuItem>
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
