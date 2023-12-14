import React, { useState, useEffect } from 'react';
import LazyTable from '../components/LazyTable';
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
const config = require('../config.json');

const marketCapColumns = [
  {
    field: 'name',
    headerName: 'Stock Ticker',
  },
  {
    field: 'market_cap',
    headerName: 'Market Cap'
  },
];

const posPctChangeColumns = [
  {
    field: 'name',
    headerName: 'Stock Ticker',
  },
  {
    field: 'pos_pct_change',
    headerName: 'Positive Percent Change'
  },
];

const negPctChangeColumns = [
  {
    field: 'name',
    headerName: 'Stock Ticker',
  },
  {
    field: 'neg_pct_change',
    headerName: 'Negative Percent Change'
  },
];

const volatilityColumns = [
  {
    field: 'name',
    headerName: 'Stock Ticker',
  },
  {
    field: 'vol',
    headerName: 'Volatility'
  },
];

const BasicStats = () => {
  const [selectedStat, setSelectedStat] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fetchedData, setFetchedData] = useState({});

  const handleSelectChange = (event) => {
    setSelectedStat(event.target.value);
  };

  const handleSubmit = async () => {
    // Reset fetchedData to an empty object before making new fetch calls
    setFetchedData({});

    try {
      // the requested route API
      const response = await fetch(`http://${config.server_host}:${config.server_port}/${selectedStat}/`
        + `?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response, e.g., update state or display the data
      const data = await response.json();

      // Update state with the fetched data using the callback form
      setFetchedData({ [selectedStat]: data });
    } catch (error) {
      console.error(`Error fetching ${selectedStat} data:`, error);
    }
  };

  // useEffect to observe changes in fetchedData and perform cleanup or side effects
  useEffect(() => {
    console.log(fetchedData);

    // Add any additional cleanup or side effects here
    // For example, you may want to update the UI or perform additional actions
  }, [fetchedData]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, ml: 15, mr: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        S&P 500 Statistics
      </Typography>
      <FormControl component="fieldset" sx={{ m: 3 }}>
        <FormGroup>
          <FormControl>
            <InputLabel id="stats-selection-label">Select Statistics</InputLabel>
            <Select
              labelId="stats-selection-label"
              id="stats-selection"
              value={selectedStat}
              onChange={handleSelectChange}
              label="Select Statistics"
            >
              <MenuItem value="market_cap">Market Cap</MenuItem>
              <MenuItem value="pos_pct_change">Positive Percent Change</MenuItem>
              <MenuItem value="neg_pct_change">Negative Percent Change</MenuItem>
              <MenuItem value="vol">Volatility</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ mb: 2, width: '48%' }}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ mb: 2, width: '48%' }}
            />
          </Box>
        </FormGroup>

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Go
        </Button>
      </FormControl>
      {/* Output frame where the results would be displayed */}
      <Paper variant="outlined" sx={{ my: 4, p: 3 }}>
        {/* Render LazyTable for the selected statistic */}
        {fetchedData[selectedStat] && (
          <LazyTable
            route={`http://${config.server_host}:${config.server_port}/${selectedStat}/`
              + `?start_date=${startDate}&end_date=${endDate}`}
            columns={chooseColumns(selectedStat)}
            defaultPageSize={1} rowsPerPageOptions={[10]}
          />
        )}
      </Paper>
    </Container>
  );
};

const chooseColumns = (selectedStat) => {
  switch (selectedStat) {
    case 'market_cap':
      return marketCapColumns;
    case 'pos_pct_change':
      return posPctChangeColumns;
    case 'neg_pct_change':
      return negPctChangeColumns;
    case 'vol':
      return volatilityColumns;
    default:
      return [];
  }
};

export default BasicStats;
