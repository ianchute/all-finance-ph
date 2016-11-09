const load = require('../../json-pg-loader/load')
const _ = require('underscore')
const db = require('../db.json')
const pg = require('pg')

load('http://api.manilainvestor.com/v1/stocks', db, (data) => {
  _.pluck(data, 'securitySymbol').forEach(symbol => {
      const client = new pg.Client(db)
      client.connect(() => {
        client.query(`
          DROP VIEW IF EXISTS v1_stocks_hdata_${symbol}_normalized;
          CREATE VIEW v1_stocks_hdata_${symbol}_normalized AS
            SELECT
            date,
            (open - (SELECT MIN(open) FROM v1_stocks_hdata_${symbol})) / ((SELECT MAX(open) FROM v1_stocks_hdata_${symbol}) - (SELECT MIN(open) FROM v1_stocks_hdata_${symbol})) AS open,
            (high - (SELECT MIN(high) FROM v1_stocks_hdata_${symbol})) / ((SELECT MAX(high) FROM v1_stocks_hdata_${symbol}) - (SELECT MIN(high) FROM v1_stocks_hdata_${symbol})) AS high,
            (low - (SELECT MIN(low) FROM v1_stocks_hdata_${symbol})) / ((SELECT MAX(low) FROM v1_stocks_hdata_${symbol}) - (SELECT MIN(low) FROM v1_stocks_hdata_${symbol})) AS low,
            (close - (SELECT MIN(close) FROM v1_stocks_hdata_${symbol})) / ((SELECT MAX(close) FROM v1_stocks_hdata_${symbol}) - (SELECT MIN(close) FROM v1_stocks_hdata_${symbol})) AS close,
            (volume - (SELECT MIN(volume) FROM v1_stocks_hdata_${symbol})) / ((SELECT MAX(volume) FROM v1_stocks_hdata_${symbol}) - (SELECT MIN(volume) FROM v1_stocks_hdata_${symbol})) AS volume
            FROM v1_stocks_hdata_${symbol};
        `, [], (err) => {
          if (err) console.log(err);
          client.end()
        })
      })
  })
})

load('http://api.manilainvestor.com/v1/fx', db, (data) => {
  _.pluck(data, 'Symbol').forEach(symbol => {
      const client = new pg.Client(db)
      client.connect(() => {
        client.query(`
          DROP VIEW IF EXISTS v1_fx_${symbol}_normalized;
          CREATE VIEW v1_fx_${symbol}_normalized AS
            SELECT
            startdate AS date,
            (price - (SELECT MIN(price) FROM v1_fx_${symbol})) / ((SELECT MAX(price) FROM v1_fx_${symbol}) - (SELECT MIN(price) FROM v1_fx_${symbol})) AS price
            FROM v1_fx_${symbol};
        `, [], (err) => {
          if (err) console.log(err);
          client.end()
        })
      })
  })
})

load('http://api.manilainvestor.com/v1/metals', db, (data) => {
  _.pluck(data, 'Symbol').forEach(symbol => {
      const client = new pg.Client(db)
      client.connect(() => {
        client.query(`
          DROP VIEW IF EXISTS v1_metals_${symbol}_normalized;
          CREATE VIEW v1_metals_${symbol}_normalized AS
            SELECT
            startdate AS date,
            (price - (SELECT MIN(price) FROM v1_metals_${symbol})) / ((SELECT MAX(price) FROM v1_metals_${symbol}) - (SELECT MIN(price) FROM v1_metals_${symbol})) AS price
            FROM v1_metals_${symbol};
        `, [], (err) => {
          if (err) console.log(err);
          client.end()
        })
      })
  })
})
