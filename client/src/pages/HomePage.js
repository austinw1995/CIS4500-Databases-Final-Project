import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const HomePage = () => {
  // Adjusted Trending Up Arrow SVG as a logo
  const Logo = () => (
    <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" fontFamily="Arial, sans-serif" fontSize="30" fill="#1976d2">ST</text>
      <path d="M45 30 L70 10" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" />
      <polyline points="62,10 70,10 70,18" stroke="#1976d2" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
  

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="flex-start" my={4}>
        {/* Logo with adjusted trending up arrow */}
        <Box my={2}>
          <Logo />
        </Box>
        {/* Application Name */}
        <Typography variant="h4" gutterBottom color="textPrimary" mb = {5}>
          Stock Trends
        </Typography>
        {/* Paragraph description */}
        <Paper elevation={3} sx={{ padding: 2, maxWidth: '100%', textAlign: 'left', marginBottom: 3 }}>
          <Typography variant="body1">
            Welcome to Stock Trends! Use the navigation bar at the top to get started. Discover historical trends and glean insights from stock and index performances between 2013 and 2018 with Stock Trends. Delve into a period of economic recovery and analyze market dynamics that parallel our current financial landscape.
          </Typography>
        </Paper>
        {/* Trend line image placeholder */}
        <Box sx={{ width: '100%', overflow: 'hidden', marginBottom: 3 }}>
          <img src="path_to_your_trend_line_image.jpg" alt="Stock Returns Trend Line" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
