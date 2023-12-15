import React, { useState } from 'react';
import { Container, TextField, FormControl, Typography, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';

export default function SP500StockQueries() {
  const [selectedStock, setSelectedStock] = useState('');
  const [statistic, setStatistic] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = () => {
    // Here you would add the logic to query the data based on selectedStock and statistic
    // For example, an API call to your backend service, which would then set the data state with the response
    console.log('Fetching data for:', selectedStock, 'with statistic:', statistic);
    // setData(response);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 2, mt: 5 }}>
        S&P 500 Stock Queries
      </Typography>
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          label="Search for S&P 500 stock"
          variant="outlined"
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="statistic-label">Statistic</InputLabel>
          <Select
            labelId="statistic-label"
            id="statistic"
            value={statistic}
            label="Statistic"
            onChange={(e) => setStatistic(e.target.value)}
          >
            <MenuItem value="mean">Mean</MenuItem>
            <MenuItem value="stdDev">Standard Deviation</MenuItem>
            <MenuItem value="min">Min</MenuItem>
            <MenuItem value="max">Max</MenuItem>
            {/* ... other options */}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Go
        </Button>
      </Box>
      {/* Visualization or table component should be rendered here based on 'data' state */}
    </Container>
  );
}
