CREATE DATABASE FINAL_PROJECT;

USE FINAL_PROJECT;

CREATE TABLE Date (
    date DATE PRIMARY KEY
);

CREATE TABLE Markets (
    marketIndex VARCHAR(15),
    date DATE,
    open DECIMAL(15, 6),
    high DECIMAL(15, 6),
    low DECIMAL(15, 6),
    close DECIMAL(15, 6),
    adjClose DECIMAL(15, 6),
    volume INT,
    closeUSD DECIMAL(15, 6),
    PRIMARY KEY (marketIndex, date),
    FOREIGN KEY (date) REFERENCES Date(date)
);

CREATE TABLE Stocks (
    date DATE,
    open DECIMAL(15, 6),
    high DECIMAL(15, 6),
    low DECIMAL(15, 6),
    close DECIMAL(15, 6),
    volume INT,
    name VARCHAR(15),
    PRIMARY KEY (name, date),
    FOREIGN KEY (date) REFERENCES Date(date)
);

DESCRIBE Stocks;

DESCRIBE Markets;

DESCRIBE Date;

CREATE TABLE Markets_Cor (
    marketIndex VARCHAR(15),
    date DATE,
    open DECIMAL(15, 6),
    high DECIMAL(15, 6),
    low DECIMAL(15, 6),
    close DECIMAL(15, 6),
    adjClose DECIMAL(15, 6),
    volume INT,
    closeUSD DECIMAL(15, 6),
    PRIMARY KEY (marketIndex, date)
);

CREATE TABLE Stocks_Cor (
    date DATE,
    open DECIMAL(15, 6),
    high DECIMAL(15, 6),
    low DECIMAL(15, 6),
    close DECIMAL(15, 6),
    volume INT,
    name VARCHAR(15),
    PRIMARY KEY (name, date)
);

SELECT COUNT(*)
FROM Stocks_Cor;

SELECT COUNT(*)
FROM Markets_Cor2;

CREATE TABLE Markets_Cor2 (
    marketIndex VARCHAR(15),
    date DATE,
    open DECIMAL(15, 6),
    high DECIMAL(15, 6),
    low DECIMAL(15, 6),
    close DECIMAL(15, 6),
    adjClose DECIMAL(15, 6),
    volume BIGINT,
    closeUSD DECIMAL(15, 6),
    PRIMARY KEY (marketIndex, date)
);

DESCRIBE Markets_Cor2;

SELECT COUNT(*)
FROM Markets_Cor2;