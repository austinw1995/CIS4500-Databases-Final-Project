const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /stock/AAPL', async () => {
  await supertest(app).get('/stock/AAPL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.stock)
    });
});

test('GET /stock/AAPL', async () => {
  await supertest(app).get('/stock/AAPL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.stock)
    });
});

test('GET /market_cap', async () => {
  await supertest(app).get('/market_cap')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.market_cap)
    });
});

test('GET /pos_pct_change', async () => {
  await supertest(app).get('/pos_pct_change')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.pos_pct_change)
    });
});

test('GET /neg_pct_change', async () => {
  await supertest(app).get('/neg_pct_change')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.neg_pct_change)
    });
});

test('GET /index_closing', async () => {
  await supertest(app).get('/index_closing/NYA')
    .expect(200)
    .then((res) => {
      const expectedResult = {"date":"1986-12-31T05:00:00.000Z","marketIndex":"NYA","closeUSD":1465.310059};

      // Assuming the response body is an array of objects
      const resultArray = res.body;

      // Check if the resultArray includes the expected result
      const includesExpectedResult = resultArray.some(item => (
        item.date === expectedResult.date &&
        item.marketIndex === expectedResult.marketIndex &&
        item.closeUSD === expectedResult.closeUSD
      ));

      expect(includesExpectedResult).toBe(true);
    });
});

test('GET /single_day_pct', async () => {
  await supertest(app).get('/single_day_pct')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.single_day_pct)
    });
});

test('GET /vol', async () => {
  await supertest(app).get('/vol')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.vol)
    });
});

test('GET /beta', async () => {
  await supertest(app).get('/beta/AAPL/NYA')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.beta)
    });
});


test('GET /stock_index_corr', async () => {
  await supertest(app).get('/stock_index_corr/AAPL/NYA')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.stock_index_corr)
    });
});



test('GET /bol_bands', async () => {
  await supertest(app).get('/bol_bands/AAPL')
    .expect(200)
    .then((res) => {
      const expectedResult = {"name":"AAPL","date":"2014-02-07T05:00:00.000Z","moving_avg":null,"upper_band":null,"lower_band":null};

      // Assuming the response body is an array of objects
      const resultArray = res.body;

      // Check if the resultArray includes the expected result
      const includesExpectedResult = resultArray.some(item => (
        item.date === expectedResult.date &&
        item.name === expectedResult.name
      ));

      expect(includesExpectedResult).toBe(true);
    });
});

test('GET /macd', async () => {
  await supertest(app).get('/macd/AAPL')
    .expect(200)
    .then((res) => {
      const expectedResult = {"name":"AAPL","date":"2014-02-07T05:00:00.000Z","twelve_days_ema":null,"twenty_six_days_ema":null,"macd_line":null,"macd_histogram":null};

      // Assuming the response body is an array of objects
      const resultArray = res.body;

      // Check if the resultArray includes the expected result
      const includesExpectedResult = resultArray.some(item => (
        item.date === expectedResult.date &&
        item.name === expectedResult.name
      ));

      expect(includesExpectedResult).toBe(true);
    });
});

test('GET /rel_strength', async () => {
  await supertest(app).get('/rel_strength/AAPL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.rel_strength)
    });
});

test('GET /stock_index_mean_comp', async () => {
  await supertest(app).get('/stock_index_mean_comp/AAPL/NYA')
    .expect(200)
    .then((res) => {
      const expectedResult = {"avg_daily_stock_return":0.00078619669118,"avg_daily_index_return":0.00030822206399};

      // Assuming the response body is an array of objects
      const resultArray = res.body;

      // Check if the resultArray includes the expected result
      const includesExpectedResult = resultArray.some(item => (
        item.date === expectedResult.date &&
        item.marketIndex === expectedResult.marketIndex &&
        item.closeUSD === expectedResult.closeUSD
      ));

      expect(includesExpectedResult).toBe(true);
    });
});

test('GET /stock_index_comparison', async () => {
  await supertest(app).get('/stock_index_comparison/AAPL/NYA')
    .expect(200)
    .then((res) => {
      const expectedResult = {"date":"2013-02-11T05:00:00.000Z","stock_ticker":"AAPL","stock_return":0.0104223467,"index_ticker":"NYA","index_return":-0.0018142719};

      // Assuming the response body is an array of objects
      const resultArray = res.body;

      // Check if the resultArray includes the expected result
      const includesExpectedResult = resultArray.some(item => (
        item.date === expectedResult.date &&
        item.marketIndex === expectedResult.marketIndex &&
        item.closeUSD === expectedResult.closeUSD
      ));

      expect(includesExpectedResult).toBe(true);
    });
});

test('GET /exp_returns', async () => {
  await supertest(app).get('/exp_returns/AAPL,GOOGL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.exp_returns)
    });
});


test('GET /stock null', async () => {
  await supertest(app)
    .get('/stock/acb')
    .expect(200)
    .then((res) => {
      // Assert that the response body includes an error message
      expect(res.body).toStrictEqual({})
    });
});

test('GET /exp_returns null', async () => {
  await supertest(app)
    .get('/exp_returns/acb')
    .expect(200)
    .then((res) => {
      // Assert that the response body includes an error message
      expect(res.body).toStrictEqual({})
    });
});

test('GET /beta null', async () => {
  await supertest(app).get('/beta/acb/acb')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual({})
    });
});