import React from 'react';
import { AppBar, Container, Toolbar, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

function NavText({ href, text }) {
  return (
    <Typography
      variant='subtitle1'
      noWrap
      component="div"
      sx={{
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        letterSpacing: '.05rem',
        color: 'white',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          padding: '6px 8px', // Optional: Adjust padding for each link if needed
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  return (
    <AppBar position='static' style={{ backgroundColor: '#2C3E50', color: '#fff' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ justifyContent: 'center' }}> {/* Center the toolbar contents */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}> {/* Space out the links */}
            <NavText href='/' text='Home' />
            <NavText href='/stats' text='S&P 500' />
            {/*<NavText href='/sp' text='S&P 500 Stock Queries' />*/}
            <NavText href='/exchange' text='Individual Stock Evaluator' />
            <NavText href='/indexes' text='Index Evaluator' />
            <NavText href='/comparisons' text='Stock/Index Comparisons' />
            <NavText href='/bloomberg' text='Stock Investment Evaluator' />
            <NavText href='/livedata' text='Live DOW' />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
