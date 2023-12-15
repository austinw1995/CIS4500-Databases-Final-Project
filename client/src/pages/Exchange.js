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

export default function StockExchangeIndexQueries() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [inputError, setInputError] = useState(null);

  const [searchQueryCalculate, setSearchQueryCalculate] = useState('');
  const [startDateCalculate, setStartDateCalculate] = useState('');
  const [endDateCalculate, setEndDateCalculate] = useState('');
  const [selectedCalculations, setSelectedCalculations] = useState([]);
  const [calculationResults, setCalculationResults] = useState(null);

  const handleSearch = () => {
    // Add logic to handle the search based on the user's input
    setInputError(null);
    console.log('Fetching data for stocks:', searchQuery);
    console.log('from:', startDate, 'to:', endDate);
    // Fetch data and update 'data' state
    fetch(`http://${config.server_host}:${config.server_port}/stock/?stocks=${searchQuery}` +
      `&start_date=${startDate}&end_date=${endDate}`
    )
      .then(res => res.json())
      .then(resJson => {
        console.log('Fetched data:', resJson);
        setData(resJson);
      })
      .catch(error => {
        console.error('Error during search:', error);
        setInputError('Error fetching data. Please check your inputs and try again.');
      });
  };

  const handleCalculate = () => {
    console.log('Calculating:', selectedCalculations, 'for stocks:', searchQueryCalculate);
    console.log('from:', startDateCalculate, 'to:', endDateCalculate);
    // Fetch data and update 'calculationResults' state
    // Create an array to store all the fetch promises
    const fetchPromises = [];

    // Loop through selectedCalculations array
    for (const calculationType of selectedCalculations) {
      // Construct the API route based on the calculation type
      let apiRoute = null;
      if (calculationType === 'exp_returns') {
        apiRoute = `http://${config.server_host}:${config.server_port}/${calculationType}?stocks=${searchQueryCalculate}`;
      } else if (calculationType === 'rel_strength') {
        apiRoute = `http://${config.server_host}:${config.server_port}/${calculationType}?stocks=${searchQueryCalculate}` +
          `&start_date=${startDateCalculate}&end_date=${endDateCalculate}`
      }
      // Fetch data for the current calculation type and store the promise
      const fetchPromise = fetch(apiRoute)
        .then(res => res.json())
        .then(resJson => {
          console.log(`Calculation results (${calculationType}):`, resJson);
          return { [calculationType]: resJson }; // Return an object with calculation type as key
        })
        .catch(error => {
          console.error(`Error during ${calculationType} calculation:`, error);
          setInputError(`Error during ${calculationType} calculation. Please check your inputs and try again.`);
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
                        <TableCell>Name</TableCell>
                        <TableCell>Results</TableCell> {/* Updated the header */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculationResults[calculationType].map((result, resultIndex) => (
                        <TableRow key={resultIndex}>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{calculationType === 'rel_strength' ? result.rsi.toFixed(4) : result.exp.toFixed(4)}</TableCell>
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

    const companyNames = [...new Set(data.map(item => item.name))];
    const companyData = companyNames.map(company => {
      const companyStocks = data.filter(item => item.name === company);
      return {
        label: company,
        data: companyStocks.map(item => ({
          x: new Date(item.date).toLocaleDateString('en-US'),
          y: item.close,
        })),
      };
    });

    const chartData = {
      datasets: companyData.map((company, index) => ({
        label: company.label,
        data: company.data,
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
          Individual Stock Trends
        </Typography>
        <TextField
          fullWidth
          label="Search for stocks"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          <MenuItem value="exp_returns">Expected Returns</MenuItem>
          <MenuItem value="rel_strength">Relative Strength</MenuItem>
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
