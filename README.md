# CIS4500-Final-Project
Team: Ashish Pothireddy, Austin Wang, Noah Erdogan, Alex Huang

## Application Description: 
- Our application aims to provide users with a comprehensive understanding of stocks’ and indices’ performances over time, with a specific focus on the 2013-2018 period. The 2013-2018 period holds several key similarities to the present, which makes it an interesting project for us to undertake. Namely, the 2013-2018 period was part of the global economic recovery from the 2008 Financial Crisis, and we similarly are in the recovery period from the COVID recession. There were also contrasting market dynamics and governmental policies in the 2013-2018 period with significant bull and bear runs and ever-shifting monetary/fiscal policies, which is very similar to the economic market we are currently in. As such, we believe the analysis that can be produced from this project has significant implications for our present. 
- With our two datasets, we plan to provide users with the ability to analyze not only individual stock performances and indices but also compare and contrast selected stock performances against chosen indices and against other stocks. The vast amount of data available to us allows us to produce very interesting queries and analysis, ranging from stock/index volatility analysis, visualizations of time-series performance data, best/worst performers, and much more. The ultimate goal is to provide an immensely flexible application that provides a user-friendly interface, allowing all users to explore/analyze the extent of the data available to them and draw their own conclusions for the looming recessionary period.

## Chosen Datasets: 
- Stock Exchange Data (https://www.kaggle.com/datasets/mattiuzc/stock-exchange-data?select=indexData.csv), the dataset contains performance data on 14 different major stock indices inducing the NYSE and NASDAQ, from 1965 to 2021. This dataset notably does not provide the S&P500 index, allowing us to further the complexity of our project by artificially creating the S&P500 index with our other dataset. The dataset contains 3 separate files, but we’ll be focusing on the index_processed.csv file, which is 10 mB. The file contains 9 attributes: a ticker for the index, date of observation, the open, the high, the low, the close, the close adjusted for dividends and stock splits, the total trading volume, and the closeUSD.
- S&P 500 Stock Data (https://www.kaggle.com/datasets/camnugent/sandp500), the data set contains 2013-2018 historical stock prices for all companies in the S&P 500 index. The table is 29.58 MB, contains 7 attributes, namely date, open, high, low, close, volume, and ticker name, and has 619040 rows. 

## How to run our project locally:
Clone our repo from our main github branch. 
Frontend installations should be done in the client directory. The list of dependencies of the frontend are listed below, and belong in a package.json file within this directory. 
Backend installations should be done in the server directory. The list of dependencies of the backend are listed below, and belong in a package.json file within this directory. 

To build the frontend: 
cd client
npm install
npm start

To build the backend:
cd server
npm install
npm start

To run backend tests:
cd server
npm test

## List of Frontend Dependencies: 
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.10.5",
    "@emotion/styled": "^11.10.5",
    "@mui/material": "^5.11.1",
    "@mui/x-data-grid": "^5.17.17",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "chart.js": "^4.4.1",
    "chartjs-adapter-moment": "^1.0.1",
    "moment": "^2.29.4",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.6.1",
    "react-scripts": "5.0.1",
    "recharts": "^2.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
## List of Backend Dependencies: 
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "nodemon server.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.20",
    "request": "^2.88.2",
    "supertest": "^6.3.3"
  },
  "devDependencies": {
    "jest": "^29.3.1"
  }
}

