const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/stock', routes.stock);
app.get('/market_cap', routes.top_market_cap);
app.get('/pos_pct_change', routes.top_pos_pct_change);
app.get('/neg_pct_change', routes.top_neg_pct_change);
app.get('/single_day_pct', routes.top_single_day_pct_change);
app.get('/vol', routes.top_vol);
app.get('/index_closing', routes.index_closing);
app.get('/exp_returns', routes.exp_returns);
app.get('/beta', routes.beta);
app.get('/sotck_index_corr', routes.stock_index_corr);
app.get('/stock_index_comparison', routes.stock_index_comparison);
app.get('/stock_index_mean_comp', routes.index_vs_stock_mean_comp);
app.get('/rel_strength', routes.rel_strength);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
