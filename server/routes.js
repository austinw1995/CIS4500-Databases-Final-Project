const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// good
const stock = async function (req, res) {
  // Selecting the stock price over time of multiple companies over a specified period of time.
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`
  SELECT date, name, close
  FROM Stocks_Cor
  WHERE name IN (${formattedCompanies}) AND date BETWEEN '${startdate}' AND '${enddate}'
  ORDER BY date ASC, name
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const top_market_cap = async function (req, res) {
  // top 10 stocks by market cap
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH TotalMarketCap AS (
    SELECT name, SUM(close * volume) AS numerator
    FROM Stocks_Cor
    WHERE date BETWEEN '${startdate}' AND '${enddate}'
    GROUP BY name
 )
 SELECT name, (numerator / (SELECT SUM(numerator) FROM TotalMarketCap)) AS market_cap
 FROM TotalMarketCap
 ORDER BY market_cap DESC, name
 LIMIT 10`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const top_pos_pct_change = async function (req, res) {
  // Identify the top 10 stocks by positive percentage change in price in a selected period of time.
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH closestBeginDate AS (
    SELECT date AS closest_beg_date
    FROM Stocks_Cor
    WHERE date <= '${startdate}'
    ORDER BY closest_beg_date DESC
    LIMIT 1
  ),
  BeginDate AS (
    SELECT name, close AS beg_price
    FROM Stocks_Cor
    WHERE date = (SELECT closest_beg_date FROM closestBeginDate)
 ),
 closestEndDate AS (
  SELECT date AS closest_end_date
  FROM Stocks_Cor
  WHERE date <= '${enddate}'
  ORDER BY closest_end_date DESC
  LIMIT 1
),
 FinalDate AS (
    SELECT name, close AS end_price
    FROM Stocks_Cor
    WHERE date = (SELECT closest_end_date FROM closestEndDate)
 ),
 Combined AS (
 SELECT BD.name, BD.beg_price, FD.end_price
 FROM BeginDate BD JOIN FinalDate FD ON BD.name = FD.name
 )
 SELECT C.name, ((C.end_price - C.beg_price)/(C.beg_price)) * 100 AS pos_pct_change
 FROM Combined C
 WHERE C.end_price >= C.beg_price
 ORDER BY pos_pct_change DESC, name
 LIMIT 10`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const top_neg_pct_change = async function (req, res) {
  //Identify the top 10 stocks by negative percentage change in price in a selected period of time.
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH closestBeginDate AS (
    SELECT date AS closest_beg_date
    FROM Stocks_Cor
    WHERE date <= '${startdate}'
    ORDER BY closest_beg_date DESC
    LIMIT 1
  ),
  BeginDate AS (
    SELECT name, close AS beg_price
    FROM Stocks_Cor
    WHERE date = (SELECT closest_beg_date FROM closestBeginDate)
 ),
 closestEndDate AS (
  SELECT date AS closest_end_date
  FROM Stocks_Cor
  WHERE date <= '${enddate}'
  ORDER BY closest_end_date DESC
  LIMIT 1
),
 FinalDate AS (
    SELECT name, close AS end_price
    FROM Stocks_Cor
    WHERE date = (SELECT closest_end_date FROM closestEndDate)
 ),
 Combined AS (
 SELECT BD.name, BD.beg_price, FD.end_price
 FROM BeginDate BD JOIN FinalDate FD ON BD.name = FD.name
 )
 SELECT C.name, ((C.end_price - C.beg_price)/(C.beg_price)) * 100 AS neg_pct_change
 FROM Combined C
 WHERE C.end_price < C.beg_price
 ORDER BY neg_pct_change ASC, name
 LIMIT 10`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const top_single_day_pct_change = async function (req, res) {
  //Identify the top 10 stocks by percentage change in price on a selected date.
  const startdate = req.query.start_date || '2013-02-08';
  connection.query(`WITH closestBeginDate AS (
    SELECT date AS closest_beg_date
    FROM Stocks_Cor
    WHERE date <= '${startdate}'
    ORDER BY closest_beg_date DESC
    LIMIT 1
  )
  SELECT name, ((close - open) / open) * 100 AS pct_change
  FROM Stocks_Cor
  WHERE date = (SELECT closest_beg_date FROM closestBeginDate)
  ORDER BY ABS(pct_change) DESC, name
  LIMIT 10`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const top_vol = async function (req, res) {
  //Top 10 volatile stocks over a selected period of time.
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH DailyReturns AS (
    SELECT
        sc.date,
        sc.name,
        sc.close,
        LAG(sc.close) OVER (PARTITION BY sc.name ORDER BY sc.date) AS prev_close
    FROM
        Stocks_Cor sc
    WHERE
        sc.date BETWEEN '${startdate}' AND '${enddate}'
 ),
 ReturnsCalc AS (
    SELECT
        dr.name,
        (dr.close - dr.prev_close) / dr.prev_close AS daily_return
    FROM
        DailyReturns dr
    WHERE
        dr.prev_close IS NOT NULL
 ),
 Volatility AS (
    SELECT
        rc.name,
        SQRT(AVG(rc.daily_return * rc.daily_return)) AS volatility
    FROM
        ReturnsCalc rc
    GROUP BY
        rc.name
 )
 SELECT
    v.name,
    v.volatility * 100 AS vol
 FROM
    Volatility v
 ORDER BY
    v.volatility DESC
 LIMIT 10;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const index_closing = async function (req, res) {
  //View the prices of multiple selected indices over a specified period of time (time series of index prices).
  //  WHERE marketIndex IN ('HSI', 'NYA', 'N100', 'NSEI')
  let indexes = req.query.indexes;
  const indexArray = indexes.split(', ');
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`SELECT date, marketIndex, closeUSD
  FROM Markets_Cor2
  WHERE marketIndex IN (${indexArray.map(ind => `'${ind}'`).join(',')}) AND date BETWEEN '${startdate}' AND '${enddate}'
  ORDER BY date ASC, marketIndex`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const exp_returns = async function (req, res) {
  //Query to determine cumulative expected returns based on a trailing 1 year period for selected stocks.
  //companies=AMD,NWL
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  connection.query(`WITH SelectedStocks AS (
    SELECT *
    FROM Stocks_Cor
    WHERE name IN (${formattedCompanies})
 ),
 DailyReturns AS (
    SELECT
        sc.name,
        sc.date,
        (sc.close - lag(sc.close) OVER (PARTITION BY sc.name ORDER BY sc.date)) / lag(sc.close) OVER (PARTITION BY sc.name ORDER BY sc.date) AS daily_return
    FROM SelectedStocks sc
 ),
 ProjectedReturns AS (
    SELECT
        name,
        MAX(date) AS end_date,
        EXP(SUM(LOG(1 + daily_return)) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 252 PRECEDING AND CURRENT ROW)) - 1 AS one_year_cumulative_return
    FROM DailyReturns
    GROUP BY name, date
 )
 SELECT name, one_year_cumulative_return
 FROM ProjectedReturns
 WHERE end_date = (SELECT MAX(date) FROM Stocks_Cor)`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// next
const beta = async function (req, res) {
  //Query to get the beta of selected stocks with respect to a chosen index.
  //AAPL,GOOGL,MSFT & NYA
  const index = req.query.index;
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH StockReturns AS (
    SELECT
        s.name,
        s.date,
        (s.close - lag(s.close) OVER (PARTITION BY s.name ORDER BY s.date)) / lag(s.close) OVER (PARTITION BY s.name ORDER BY s.date) AS daily_return
    FROM
        Stocks_Cor s
    WHERE
        s.name IN (${formattedCompanies})
        AND s.date BETWEEN '${startdate}' AND '${enddate}'
),
MarketReturns AS (
    SELECT
        m.date,
        (m.closeUSD - lag(m.closeUSD) OVER (ORDER BY m.date)) / lag(m.closeUSD) OVER (ORDER BY m.date) AS daily_return
    FROM
        Markets_Cor2 m
    WHERE
        m.marketIndex = '${index}'
        AND m.date BETWEEN '${startdate}' AND '${enddate}'
)
SELECT
    sr.name,
    (
        SUM(sr.daily_return * mr.daily_return) -
        SUM(mr.daily_return) * SUM(sr.daily_return) / COUNT(*)
    ) / (
        SUM(POWER(mr.daily_return, 2)) - POWER(SUM(mr.daily_return), 2) / COUNT(*)
    ) AS beta
FROM
    StockReturns sr
JOIN
    MarketReturns mr ON sr.date = mr.date
GROUP BY
    sr.name;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// next
const stock_index_corr = async function (req, res) {
  //Calculates correlation between the average price of multiple stocks (can also just be one stock) and a selected index.
  const index = req.query.index;
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  connection.query(`WITH SELECTED_STOCKS AS (
    SELECT date, AVG(close) AS close
    FROM Stocks_Cor
    WHERE name IN (${formattedCompanies})
    GROUP BY date
    ORDER BY date ASC
 ),
 StockAndIndex AS (
    SELECT S.date, S.close AS stock_price, I.closeUSD AS index_price
    FROM SELECTED_STOCKS S JOIN Markets_Cor2 I ON S.date = I.date
    WHERE I.marketIndex = '${index}'
 ),
 Averages AS (
    SELECT
        AVG(stock_price) AS avg_stock_price,
       AVG(index_price) AS avg_index_price
    FROM StockAndIndex
 )
 SELECT (SUM((S.stock_price - A.avg_stock_price) * (S.index_price - A.avg_index_price)) / (COUNT(*) - 1)) /
 (SQRT(SUM(POW(S.stock_price - A.avg_stock_price, 2)) / (COUNT(*) - 1)) * SQRT(SUM(POW(S.index_price - A.avg_index_price, 2)) / (COUNT(*) - 1))) AS correlation
 FROM StockAndIndex S, Averages A`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

const stock_index_comparison = async function (req, res) {
  //Compare and contrast the performance of selected S&P 500 stocks with selected indices
  //HSI', 'NYA', 'N100', 'NSEI
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  let inds = req.query.indexes;
  let indexesArray = inds.split(', ');
  connection.query(`WITH StockReturns AS (
    SELECT
        date,
        name AS ticker,
        (close - LAG(close) OVER (PARTITION BY name ORDER BY date)) / LAG(close) OVER (PARTITION BY name ORDER BY date) AS close
    FROM Stocks_Cor
    WHERE name IN (${companiesArray.map(comp => `'${comp}'`).join(',')})
),
IndexReturns AS (
    SELECT
        date,
        marketIndex AS ticker,
        (closeUSD - LAG(closeUSD) OVER (PARTITION BY marketIndex ORDER BY date)) / LAG(closeUSD) OVER (PARTITION BY marketIndex ORDER BY date) AS close
    FROM Markets_Cor2
    WHERE marketIndex IN (${indexesArray.map(comp => `'${comp}'`).join(',')}) AND date BETWEEN '2013-02-08' AND '2018-02-07'
)
SELECT sr.date, sr.ticker AS ticker, sr.close
FROM StockReturns sr
WHERE sr.close IS NOT NULL
UNION
SELECT ir.date, ir.ticker AS ticker, ir.close
FROM IndexReturns ir
WHERE ir.close IS NOT NULL
ORDER BY date;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}


const index_vs_stock_mean_comp = async function (req, res) {
  //Query to take the mean of selected stocks and compare with selected indices 
  //to see how a batch of stocks have performed in comparison to the overall market performance of particular markets.
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  let inds = req.query.indexes;
  let indexesArray = inds.split(', ');
  connection.query(`WITH SELECTED_STOCKS AS (
    SELECT date, 'SELECTED_STOCKS' AS ticker, AVG(close) AS close
    FROM Stocks_Cor
    WHERE name IN (${companiesArray.map(comp => `'${comp}'`).join(',')})
    GROUP BY date
    ORDER BY date ASC
    ),
SELECTED_INX AS (
        SELECT date, marketIndex AS ticker, closeUSD
        FROM Markets_Cor2
        WHERE marketIndex IN (${indexesArray.map(comp => `'${comp}'`).join(',')}) AND date BETWEEN '2013-02-08' AND '2018-02-07'
        ORDER BY date, marketIndex
    ),
StockReturns AS (
    SELECT
        date,
        ticker,
        (close - LAG(close) OVER (PARTITION BY ticker ORDER BY date)) / LAG(close) OVER (PARTITION BY ticker ORDER BY date) AS close
    FROM SELECTED_STOCKS
),
IndexReturns AS (
    SELECT
        date,
        ticker,
        (closeUSD - LAG(closeUSD) OVER (PARTITION BY ticker ORDER BY date)) / LAG(closeUSD) OVER (PARTITION BY ticker ORDER BY date) AS close
    FROM SELECTED_INX
)
SELECT sr.date, sr.ticker AS ticker, sr.close
FROM StockReturns sr
WHERE sr.close IS NOT NULL
UNION
SELECT ir.date, ir.ticker AS ticker, ir.close
FROM IndexReturns ir
WHERE ir.close IS NOT NULL
ORDER BY date;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// good
const rel_strength = async function (req, res) {
  //Calculates the relative strength index of selected stocks, and ranks them in descending order
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  const startdate = req.query.start_date || '2013-02-08';
  console.log(startdate);
  const enddate = req.query.end_date || '2018-02-07';
  console.log(enddate);
  connection.query(`WITH SELECTED_STOCKS AS (
    SELECT name, date, close
    FROM Stocks_Cor
    WHERE name IN (${formattedCompanies}) AND date BETWEEN '${startdate}' AND '${enddate}' 
  ),
  STOCK_PRICE_CHANGES AS (
     SELECT
         S1.name,
         S1.date,
         (S1.close - LAG(S1.close) OVER (PARTITION BY S1.name ORDER BY S1.date)) AS price_change
     FROM SELECTED_STOCKS S1
  ),
  AVG_GAINS_LOSSES AS (
     SELECT
         name,
         AVG(CASE WHEN price_change > 0 THEN price_change ELSE 0 END) AS avg_gain,
         AVG(CASE WHEN price_change < 0 THEN ABS(price_change) ELSE 0 END) AS avg_loss
     FROM STOCK_PRICE_CHANGES
     GROUP BY name
  )
  SELECT name, 100 - (100 / (1 + avg_gain / avg_loss)) AS rsi
  FROM AVG_GAINS_LOSSES
  WHERE avg_loss <> 0
  ORDER BY rsi;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

// next
const bol_bands = async function (req, res) {
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`
    SELECT
        name,
        date,
        AVG(close) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 20 PRECEDING AND CURRENT ROW) AS moving_avg,
        AVG(close) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 20 PRECEDING AND CURRENT ROW) + 
        2 * STDDEV(close) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 20 PRECEDING AND CURRENT ROW) AS upper_band,
        AVG(close) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 20 PRECEDING AND CURRENT ROW) - 
        2 * STDDEV(close) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 20 PRECEDING AND CURRENT ROW) AS lower_band
    FROM
        Stocks_Cor
    WHERE name IN (${formattedCompanies}) AND date BETWEEN '${startdate}' AND '${enddate}'
    ORDER BY
        name, date;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const macd = async function (req, res) {
  //Calculates the relative strength index of selected stocks, and ranks them in descending order
  let companies = req.query.stocks;
  const companiesArray = companies.split(', ');
  const formattedCompanies = companiesArray.map(comp => `'${comp}'`).join(',');
  const startdate = req.query.start_date || '2013-02-08';
  const enddate = req.query.end_date || '2018-02-07';
  connection.query(`WITH StockPriceChanges AS (
    SELECT
        name,
        date,
        close - LAG(close) OVER (PARTITION BY name ORDER BY date) AS price_change
    FROM
        Stocks_Cor
    WHERE
        name IN (${formattedCompanies})
        AND date BETWEEN '${startdate}' AND '${enddate}'
),
MACDValues AS (
    SELECT
        name,
        date,
        AVG(price_change) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 12 PRECEDING AND CURRENT ROW) AS twelve_days_ema,
        AVG(price_change) OVER (PARTITION BY name ORDER BY date ROWS BETWEEN 26 PRECEDING AND CURRENT ROW) AS twenty_six_days_ema,
        AVG(price_change) OVER (PARTITION BY name ORDER BY date) AS macd_line
    FROM
        StockPriceChanges
)
SELECT
    name,
    date,
    twelve_days_ema,
    twenty_six_days_ema,
    macd_line
FROM
    MACDValues
ORDER BY
    name, date;`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
}

module.exports = {
  stock, top_market_cap, top_pos_pct_change, top_neg_pct_change, top_single_day_pct_change, top_vol, index_closing,
  exp_returns, beta, stock_index_corr, stock_index_comparison, index_vs_stock_mean_comp, rel_strength, bol_bands, macd
}