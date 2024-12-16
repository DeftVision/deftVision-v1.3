import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skeleton, Box } from '@mui/material'


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ShopperScore() {
    const [chartData, setChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchShopperScores = async () => {
        try {
            const response = await fetch('http://localhost:8005/api/shopper/scores')
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json()

            const formattedData = {
                labels: data.metrics,
                datasets: data.shopper.map((shopper) => ({
                    label: shopper.firstName + shopper.lastName,
                    data: shopper.finalScore,
                    backgroundColor:
                        `rgba(${Math.floor(Math.random() * 255)}, 
                            ${Math.floor(Math.random() * 255)}, 
                            ${Math.floor(Math.random() * 255)}, 
                            0.6)`,
                }))
            }
            setChartData(formattedData)
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }
        fetchShopperScores();
    }, [])

    console.log('chartData:', chartData);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Shopper Scores',
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
        <div>
            <Bar data={chartData} options={options} />
        </div>
    );
}
