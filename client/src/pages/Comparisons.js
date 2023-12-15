import React, { useState } from 'react';
import {
  Container, TextField, FormControl, InputLabel, Select, MenuItem, Button,
  Box, Typography
} from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

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

  const [selectedIndexesCalculate, setSelectedIndexesCalculate] = useState('');
  const [searchQueryCalculate, setSearchQueryCalculate] = useState('');
  const [startDateCalculate, setStartDateCalculate] = useState('');
  const [endDateCalculate, setEndDateCalculate] = useState('');
  const [selectedCalculations, setSelectedCalculations] = useState([]);
  const [calculationResults, setCalculationResults] = useState(null);

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

  const handleCalculate = () => {
    console.log('Calculating:', selectedCalculations, 'for stocks:', searchQueryCalculate);
    console.log('for indexes:', selectedIndexesCalculate);
    console.log('from:', startDateCalculate, 'to:', endDateCalculate);
    // Fetch data and update 'calculationResults' state
    // Create an array to store all the fetch promises
    const fetchPromises = [];

    // Loop through selectedCalculations array
    for (const calculationType of selectedCalculations) {
      // Construct the API route based on the calculation type
      let apiRoute = null;
      if (calculationType === 'beta') {
        apiRoute = `http://${config.server_host}:${config.server_port}/${calculationType}?stocks=${searchQueryCalculate}` +
          `&start_date=${startDateCalculate}&end_date=${endDateCalculate}` +
          `&index=${selectedIndexesCalculate}`
      } else if (calculationType === 'stock_index_corr') {
        apiRoute = `http://${config.server_host}:${config.server_port}/${calculationType}?stocks=${searchQueryCalculate}` +
          `&index=${selectedIndexesCalculate}`
      }
      // Fetch data for the current calculation type and store the promise
      const fetchPromise = fetch(apiRoute)
        .then(res => res.json())
        .then(resJson => {
          console.log(`Calculation results (${calculationType}):`, resJson);
          return { [calculationType]: resJson }; // Return an object with calculation type as key
        });
      fetchPromises.push(fetchPromise);
    }

    // Wait for all fetch promises to resolve
    Promise.all(fetchPromises)
      .then(resultsArray => {
        // Combine results from all calculations into a single object
        const combinedResults = Object.assign({}, ...resultsArray);
        console.log('Combined Calculation Results:', combinedResults);

        // Update 'calculationResults' state with the combined results
        setCalculationResults(combinedResults);
      })
      .catch(error => {
        console.error('Error during calculations:', error);
      });
  };

  const renderTable = () => {
    if (!calculationResults) return null;

    // Extract keys (calculation types) from the combined results
    const calculationTypes = Object.keys(calculationResults);

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {calculationTypes.map((calculationType, index) => (
              <TableRow key={index}>
                <TableCell>{calculationType}</TableCell>
                <TableCell>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {calculationType !== 'stock_index_corr' && <TableCell>Name</TableCell>}
                        <TableCell>Results</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculationResults[calculationType].map((result, resultIndex) => (
                        <TableRow key={resultIndex}>
                          {calculationType !== 'stock_index_corr' && <TableCell>{result.name}</TableCell>}
                          <TableCell>{result.beta}</TableCell>
                          <TableCell>{result.correlation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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
      <Typography variant="h4" gutterBottom>
        Analysis
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Select Calculations</InputLabel>
        <Select
          multiple
          value={selectedCalculations}
          onChange={(e) => setSelectedCalculations(e.target.value)}
          label="Select Calculations"
          renderValue={(selected) => selected.join(', ')}
        >
          <MenuItem value="beta">Beta</MenuItem>
          <MenuItem value="stock_index_corr">Stock Index Correlation</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Search for stocks"
        variant="outlined"
        value={searchQueryCalculate}
        onChange={(e) => setSearchQueryCalculate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Search for an Index"
        variant="outlined"
        value={selectedIndexesCalculate}
        onChange={(e) => setSelectedIndexesCalculate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        type="date"
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={startDateCalculate}
        onChange={(e) => setStartDateCalculate(e.target.value)}
        sx={{ mb: 2, width: '50%' }}
      />
      <TextField
        type="date"
        label="End Date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={endDateCalculate}
        onChange={(e) => setEndDateCalculate(e.target.value)}
        sx={{ mb: 2, width: '50%' }}
      />
      <Button variant="contained" color="primary" onClick={() => handleCalculate()}>
        Calculate
      </Button>
      {renderTable()}
    </Container>
  );
}
