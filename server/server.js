const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const axios = require('axios');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/stock', routes.stock);
app.get('/market_cap', routes.top_market_cap);
app.get('/pos_pct_change', routes.top_pos_pct_change);
app.get('/neg_pct_change', routes.top_neg_pct_change);
app.get('/single_day_pct', routes.top_single_day_pct_change);
app.get('/vol', routes.top_vol);
app.get('/index_closing', routes.index_closing);
app.get('/exp_returns', routes.exp_returns);
app.get('/beta', routes.beta);
app.get('/stock_index_corr', routes.stock_index_corr);
app.get('/stock_index_comparison', routes.stock_index_comparison);
app.get('/stock_index_mean_comp', routes.index_vs_stock_mean_comp);
app.get('/rel_strength', routes.rel_strength);
app.get('/bol_bands', routes.bol_bands);
app.get('/macd', routes.macd);
app.get('/alphavantage_data', async (req, res) => {
  try {
    const apiUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=DIA&apikey=A26ZCS4SYYRZWJS0';
    const response = await axios.get(apiUrl);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//var request = require('request');



// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=W2BS2HZV2HGQ00RF';


// axios.get(url)
//   .then(response => {
//     // Handle the data here, for example:
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
