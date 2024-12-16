import {Box, Typography} from '@mui/material';
import ReactApexChart from 'react-apexcharts';

export default function finalScore () {
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
        labels: ['Final Score']
    }

    const series = [85]
    return (
        <div>
            <ReactApexChart options={options} series={series} type={"radialBar"} height={250} sx={{ margin: 'auto', marginBottom: 50 }}/>
        </div>
    );
};

