const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

test('GET /stock/AAPL', async () => {
  await supertest(app).get('/stock/?stocks=AAPL')
    .expect(200)
    .then((res) => {
      // Use arrayContaining to check that a subset of an array is in the response
      expect(res.body).toEqual(expect.arrayContaining(results.stock));
    });
});


test('GET /market_cap/AAPL', async () => {
  await supertest(app).get('/market_cap/?stocks=AAPL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.market_cap)
    });
});

test('GET /pos_pct_change/GOOG', async () => {
  await supertest(app).get('/pos_pct_change/?stocks=GOOGL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.pos_pct_change)
    });
});

test('GET /neg_pct_change/GOOG', async () => {
  await supertest(app).get('/neg_pct_change/?stocks=GOOGL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.neg_pct_change)
    });
});

test('GET /index_closing/NYA', async () => {
  await supertest(app).get('/index_closing/?indexes=NYA')
    .expect(200)
    .then((res) => {
      // Use arrayContaining to check that a subset of an array is in the response
      expect(res.body).toEqual(expect.arrayContaining(results.index_closing));
    });
});


test('GET /single_day_pct', async () => {
  await supertest(app).get('/single_day_pct/?stocks=GOOGL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.single_day_pct)
    });
});

jest.setTimeout(100000)
test('GET /vol', async () => {
  await supertest(app).get('/vol/')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.vol)
    });
});

jest.setTimeout(100000)
test('GET /beta', async () => {
  await supertest(app).get('/beta/?stocks=AAPL&index=NYA')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.beta)
    });
});


test('GET /stock_index_corr', async () => {
  await supertest(app).get('/stock_index_corr/?stocks=AAPL&index=NYA')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.stock_index_corr)
    });
});



test('GET /bol_bands', async () => {
  await supertest(app).get('/bol_bands/?stocks=AAPL')
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
  await supertest(app).get('/macd/?stocks=AAPL')
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
  await supertest(app).get('/rel_strength/?stocks=GOOGL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.rel_strength)
    });
});

test('GET /stock_index_mean_comp', async () => {
  await supertest(app).get('/stock_index_mean_comp/?stocks=AAPL&indexes=NYA')
  .expect(200)
  .then((res) => {
    // Use arrayContaining to check that a subset of an array is in the response
    expect(res.body).toEqual(expect.arrayContaining(results.stock_index_mean_comp));
  });
});

test('GET /stock_index_comparison', async () => {
  await supertest(app).get('/stock_index_comparison/?stocks=AAPL&indexes=NYA')
  .expect(200)
  .then((res) => {
    // Use arrayContaining to check that a subset of an array is in the response
    expect(res.body).toEqual(expect.arrayContaining(results.stock_index_comparison));
  });
});

test('GET /exp_returns', async () => {
  await supertest(app).get('/exp_returns/?stocks=AAPL')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual(results.exp_returns)
    });
});


test('GET /stock null', async () => {
  await supertest(app)
    .get('/stock/?stocks=acb')
    .expect(200)
    .then((res) => {
      // Assert that the response body includes an error message
      expect(res.body).toStrictEqual([])
    });
});

test('GET /exp_returns null', async () => {
  await supertest(app)
    .get('/exp_returns/?stocks=acb')
    .expect(200)
    .then((res) => {
      // Assert that the response body includes an error message
      expect(res.body).toStrictEqual([])
    });
});

test('GET /beta null', async () => {
  await supertest(app).get('/beta/?stocks=acb&index=acb')
    .expect(200)
    .then((res) => {
      expect(res.body).toStrictEqual([])
    });
});