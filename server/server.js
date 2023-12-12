const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/stock/:stocks', routes.stock);
app.get('/market_cap', routes.top_market_cap);
app.get('/pos_pct_change', routes.top_pos_pct_change);
app.get('/neg_pct_change', routes.top_neg_pct_change);
app.get('/single_day_pct', routes.top_single_day_pct_change);
app.get('/vol', routes.top_vol);
app.get('/index_closing/:indexes', routes.index_closing);
app.get('/exp_returns/:stocks', routes.exp_returns);
app.get('/beta/:stocks/:index', routes.beta);
app.get('/stock_index_corr/:stocks/:index', routes.stock_index_corr);
app.get('/stock_index_comparison/:stocks/:indexes', routes.stock_index_comparison);
app.get('/stock_index_mean_comp/:stocks/:indexes', routes.index_vs_stock_mean_comp);
app.get('/rel_strength/:stocks', routes.rel_strength);
app.get('/bol_bands/:stocks', routes.bol_bands);
app.get('/macd/:stocks', routes.macd);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
