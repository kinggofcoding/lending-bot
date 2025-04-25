import React from 'react';
import { Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface RateData {
  [currency: string]: {
    rate: number;
    available: number;
  };
}

interface RateChartProps {
  data: RateData;
}

const RateChart: React.FC<RateChartProps> = ({ data }) => {
  const currencies = Object.keys(data);
  const rates = currencies.map(currency => data[currency].rate * 100); // 轉換為百分比

  const chartData = {
    labels: currencies,
    datasets: [
      {
        label: '年化利率 (%)',
        data: rates,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '各貨幣當前放貸年化利率',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '年化利率 (%)',
        },
      },
    },
  };

  return (
    <Box sx={{ height: 300 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default RateChart;