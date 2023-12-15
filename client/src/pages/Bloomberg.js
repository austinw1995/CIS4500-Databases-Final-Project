import React, { useState } from 'react';
import { Container, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
const config = require('../config.json');

export default function BloombergTerminal() {
  const [selectedStock, setSelectedStock] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);

  const handleCompare = () => {
    console.log('Fetching data for stock:', selectedStock, 'from:', startDate, 'to:', endDate);
    fetch(`http://${config.server_host}:${config.server_port}/stock/?stocks=${selectedStock}&start_date=${startDate}&end_date=${endDate}`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Fetched data:', resJson);
        setData(resJson);
      });
  };

  const renderLineChart = () => {
    if (!data) return null;

    const chartData = {
      labels: data.map(item => item.date),
      datasets: [{
        label: selectedStock,
        data: data.map(item => item.close),
        borderColor: 'rgba(33, 150, 243, 1)',
        fill: false,
      }]
    };

    return <Line data={chartData} />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bloomberg Terminal
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="stock-label">Select Stock</InputLabel>
          <Select
            labelId="stock-label"
            id="stock-select"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
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
