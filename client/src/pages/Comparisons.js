import React, { useState } from 'react';
import {
  Container, TextField, FormControl, InputLabel, Select, MenuItem, Button,
  Box, Typography
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
const config = require('../config.json');

export default function StockIndexComparison() {
  const [selectedIndexes, setSelectedIndexes] = useState('');
  const [selectedStocks, setSelectedStocks] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = () => {
    // Add logic to handle the search based on the user's input
    console.log('Fetching data for indexes:', selectedIndexes, '. Fetching data for stocks:', selectedStocks);
    // Fetch data and update 'data' state
    fetch(`http://${config.server_host}:${config.server_port}/stock_index_comparison/?indexes=${selectedIndexes}` +
      `&stocks=${selectedStocks}`
    )
      .then(res => res.json())
      .then(resJson => {
        console.log('Fetched data:', resJson);
        setData(resJson);
      });
  };

  // Render line chart when data is available
  const renderLineChart = () => {
    if (!data) return null;

    const tickerNames = [...new Set(data.map(item => item.ticker))];
    const tickerData = tickerNames.map(identifier => {
      const identifierData = data.filter(item => item.ticker === identifier);
      return {
        label: identifier,
        data: identifierData.map(item => ({
          x: new Date(item.date).toLocaleDateString('en-US'),
          y: item.returns,
        })),
      };
    });

    const chartData = {
      datasets: tickerData.map((index, idx) => ({
        label: index.label,
        data: index.data,
        borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`, // Random color
        fill: false,
      })),
    };
    console.log(chartData);

    return (
      <Line
        data={chartData}
        options={{
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
        }}

      />
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Stock/Index Comparisons
        </Typography>
        <TextField
          fullWidth
          label="Search for indexes"
          variant="outlined"
          value={selectedIndexes}
          onChange={(e) => setSelectedIndexes(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Search for stocks"
          variant="outlined"
          value={selectedStocks}
          onChange={(e) => setSelectedStocks(e.target.value)}
          sx={{ mb: 2 }}
        />
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
        <Button variant="contained" color="primary" onClick={() => handleSearch()}>
          Go
        </Button>
      </Box>
      {/* Visualization or table component should be rendered here based on 'data' state */}
      <div>
        {/*
        {data && (
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        */}
        {data && renderLineChart()}
      </div>
    </Container>
  );
}
