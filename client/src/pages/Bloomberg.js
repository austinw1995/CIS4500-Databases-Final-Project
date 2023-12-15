import React, { useState } from 'react';
import { Container, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
const config = require('../config.json');

export default function BloombergTerminal() {
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);

  const handleCompare = () => {
    if (selectedMethod === 'Bollinger Bands') {
      console.log('Fetching data for stock:', selectedStock, 'from:', startDate, 'to:', endDate);
      fetch(`http://${config.server_host}:${config.server_port}/bol_bands/?stocks=${selectedStock}&start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(resJson => {
          console.log('Fetched data:', resJson);
          setData(resJson);
        });
    } else if (selectedMethod === 'Moving Average') {
      console.log('Fetching data for stock:', selectedStock, 'from:', startDate, 'to:', endDate);
      fetch(`http://${config.server_host}:${config.server_port}/macd/?stocks=${selectedStock}&start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(resJson => {
          console.log('Fetched data:', resJson);
          setData(resJson);
        });
    }
  };

  const renderLineChart = () => {
    if (!data) return null;

    const companyNames = [...new Set(data.map(item => item.name))];
    const companyData = companyNames.map(company => {
      const companyStocks = data.filter(item => item.name === company);
      return {
        label: company,
        datasets: selectedMethod === 'Bollinger Bands' ? (
          // Bollinger Bands
          [
            {
              label: `${company} - Lower Band`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.lower_band,
              })),
              borderColor: 'rgba(255, 0, 0, 1)',
              fill: false,
              pointRadius: 2,
            },
            {
              label: `${company} - Moving Average`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.moving_avg,
              })),
              borderColor: 'rgba(0, 255, 0, 1)',
              fill: false,
              pointRadius: 2,
            },
            {
              label: `${company} - Upper Band`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.upper_band,
              })),
              borderColor: 'rgba(0, 0, 255, 1)',
              fill: false,
              pointRadius: 2,
            },
          ]
        ) : (
          // Moving Average
          [
            {
              label: `${company} - MACD Line`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.macd_line,
              })),
              borderColor: 'rgba(255, 0, 0, 1)',
              fill: false,
              pointRadius: 2,
            },
            {
              label: `${company} - Twelve Days EMA`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.twelve_days_ema,
              })),
              borderColor: 'rgba(0, 255, 0, 1)',
              fill: false,
              pointRadius: 2,
            },
            {
              label: `${company} - Twenty Six Days EMA`,
              data: companyStocks.map(item => ({
                x: new Date(item.date).toLocaleDateString('en-US'),
                y: item.twenty_six_days_ema,
              })),
              borderColor: 'rgba(0, 0, 255, 1)',
              fill: false,
              pointRadius: 2,
            },
          ]
        ),
      };
    });

    const chartData = {
      datasets: companyData.reduce((acc, curr) => [...acc, ...curr.datasets], []),
    };

    const options = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            parser: 'MM/DD/YYYY',
            tooltipFormat: 'll',
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bloomberg Terminal
        </Typography>
        <TextField
          fullWidth
          label="Search for stock"
          variant="outlined"
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="stock-label">Select Method</InputLabel>
          <Select
            labelId="stock-label"
            id="stock-select"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            label="Select Stock"
          >
            <MenuItem value="Bollinger Bands">Bollinger Bands</MenuItem>
            <MenuItem value="Moving Average">Moving Average</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ mb: 2, width: '50%' }}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ mb: 2, width: '50%' }}
        />
        <Button variant="contained" color="primary" onClick={handleCompare}>
          Go
        </Button>
        {data && renderLineChart()}
      </Box>
    </Container>
  );
}
