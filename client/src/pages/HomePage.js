import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import LazyTable from '../components/LazyTable';
import Livedata from './Livedata';
const config = require('../config.json');

const singlePctChangeColumns = [
  {
    field: 'name',
    headerName: 'Stock Ticker',
  },
  {
    field: 'pct_change',
    headerName: 'Percent Change'
  },
];

function getRandomDate() {
  // Set the start and end dates
  const startDate = new Date('2013-02-08');
  const endDate = new Date('2018-02-07');

  // Calculate the difference in milliseconds between the start and end dates
  const dateDifference = endDate.getTime() - startDate.getTime();

  // Generate a random number within the date range
  const randomTime = startDate.getTime() + Math.random() * dateDifference;

  // Create a new date object with the random time
  const randomDate = new Date(randomTime);

  // Format the date to 'YYYY-MM-DD'
  const formattedDate =
    randomDate.getFullYear() +
    '-' +
    String(randomDate.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(randomDate.getDate()).padStart(2, '0');

  return formattedDate;
}

const getRandomYear = () => {
  // Generate a random year between 2014 and 2017 (inclusive)
  return Math.floor(Math.random() * (2017 - 2014 + 1)) + 2014;
};

const getTodayFormatted = (randomYear) => {
  const today = new Date();

  // Set the random year in the date
  today.setFullYear(randomYear);

  // Format the date to 'YYYY-MM-DD'
  const formattedDate =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  return formattedDate;
};

const getYearsAgoString = (randomYear) => {
  const today = new Date();

  const yearsAgo = today.getFullYear() - randomYear;
  return `on this day ${yearsAgo} years ago (${randomYear})`;
};



const HomePage = () => {
  // Adjusted Trending Up Arrow SVG as a logo
  const randomYear = getRandomYear();

  const todayFormatted = getTodayFormatted(randomYear);

  const yearsAgoString = getYearsAgoString(randomYear);
  const Logo = () => (
    <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" fontFamily="Arial, sans-serif" fontSize="30" fill="#1976d2">MM</text>
      <path d="M57 30 L82 10" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" />
      <polyline points="74,10 82,10 82,18" stroke="#1976d2" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
  const today = new Date();



  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="flex-start" my={4}>
        {/* Logo with adjusted trending up arrow */}
        <Box my={2}>
          <Logo />
        </Box>
        {/* Application Name */}
        <Typography variant="h4" gutterBottom color="textPrimary" mb={5}>
          Market Mosaic
        </Typography>
        {/* Paragraph description */}
        <Paper elevation={3} sx={{ padding: 2, maxWidth: '100%', textAlign: 'left', marginBottom: 3 }}>
          <Typography variant="body1">
            Welcome to Market Mosaic! Use the navigation bar at the top to get started. Discover historical trends and glean insights from stock and index performances between 2013 and 2018 with Stock Trends. Delve into a period of economic recovery and analyze market dynamics that parallel our current financial landscape.
          </Typography>
        </Paper>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Stock Fact of the Day: Here are today's ({todayFormatted}) top 10 biggest gainers and losers {yearsAgoString}:
        </Typography>
        <LazyTable
          route={`http://${config.server_host}:${config.server_port}/single_day_pct`
            + `?start_date=${todayFormatted}`}
          columns={singlePctChangeColumns}
          defaultPageSize={1} rowsPerPageOptions={[10]}
        />
        <Typography variant="body2" mt={2}>
          Website created by Austin Wang, Ashish Pothireddy, Noah Erdogan, and Alex Huang
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;