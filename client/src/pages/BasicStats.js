import React, { useState } from 'react';
import { Container, Typography, FormControl, FormGroup, FormControlLabel, Checkbox, Button, Paper } from '@mui/material';

const BasicStats = () => {
  const [statsSelection, setStatsSelection] = useState({
    mean: false,
    standardDeviation: false,
    min: false,
    max: false,
    percentiles: false,
  });

  const handleChange = (event) => {
    setStatsSelection({ ...statsSelection, [event.target.name]: event.target.checked });
  };

  const handleSubmit = () => {
    // Here you would handle the submission, perhaps making an API call
    // to fetch the stats based on the user's selection and then displaying
    // them in the output frame.
    console.log(statsSelection);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, ml: 15, mr: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        S&P 500 Statistics
      </Typography>
      <FormControl component="fieldset" sx={{ m: 3 }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={statsSelection.mean} onChange={handleChange} name="mean" />}
            label="Mean"
          />
          <FormControlLabel
            control={<Checkbox checked={statsSelection.standardDeviation} onChange={handleChange} name="standardDeviation" />}
            label="Standard Deviation"
          />
          <FormControlLabel
            control={<Checkbox checked={statsSelection.min} onChange={handleChange} name="min" />}
            label="Min"
          />
          <FormControlLabel
            control={<Checkbox checked={statsSelection.max} onChange={handleChange} name="max" />}
            label="Max"
          />
          <FormControlLabel
            control={<Checkbox checked={statsSelection.percentiles} onChange={handleChange} name="percentiles" />}
            label="Percentiles"
          />
        </FormGroup>
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Go
        </Button>
      </FormControl>
      {/* Output frame where the results would be displayed */}
      <Paper variant="outlined" sx={{ my: 4, p: 3 }}>
        {/* Results will be displayed here after fetching the data */}
        <Typography>Statistics will be displayed here...</Typography>
      </Paper>
    </Container>
  );
};

export default BasicStats;
