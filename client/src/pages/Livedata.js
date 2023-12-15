import React, { useState, useEffect } from 'react';
import { Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
const config = require('../config.json'); // Assuming this import is correct

const Livedata = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const topRowsToShow = 10;

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/alphavantage_data`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []); 

  return (
    <div>
      <Typography variant="h5" gutterBottom color="textPrimary" mt={2}>
        {data && data['Meta Data']['2. Symbol']} Stock Data
      </Typography>
      {data && (
        <Paper elevation={3} sx={{ padding: 2, maxWidth: '100%', textAlign: 'left', marginBottom: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Open</TableCell>
                  <TableCell>High</TableCell>
                  <TableCell>Low</TableCell>
                  <TableCell>Close</TableCell>
                  <TableCell>Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(data['Time Series (Daily)']).slice(0, topRowsToShow).map(([date, stockData]) => (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{stockData['1. open']}</TableCell>
                    <TableCell>{stockData['2. high']}</TableCell>
                    <TableCell>{stockData['3. low']}</TableCell>
                    <TableCell>{stockData['4. close']}</TableCell>
                    <TableCell>{stockData['5. volume']}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default Livedata;