const app = require('express')()
const pg = require('pg')
const db = require('./db.json')
const client = new pg.Client(db)
const category_names = {
  stock: 'stocks',
  currency: 'fx',
  metal: 'metals'
}
const specific_names = {
  stock: 'stocks_hdata',
  currency: 'fx',
  metal: 'metals'
}

client.connect(serve)

function serve(err) {
  if (err) {
    console.log(err)
    return
  }

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    next()
  })

  app.get('/meta/:category', function (req, res) {

    let { category } = req.params

    category = category_names[category] // special handling

    if (!category)
      res.send(null)

    client.query(`SELECT * FROM v1_${category};`, [], function(err, result) {

      if (err) {
        console.log(err)
        res.status(418).send(null)
      } else {
        res.send(result.rows)
      }

    })

  })

  app.get('/actual/:category/:symbol', function (req, res) {

    let { category, symbol } = req.params

    category = specific_names[category] // special handling

    if (!category || !symbol)
      res.send(null)

    client.query(`SELECT * FROM v1_${category}_${symbol};`, [], function(err, result) {

      if (err) {
        console.log(err)
        res.status(418).send(null)
      } else {
        res.send(result.rows)
      }

    })


  })

  app.get('/normalized/:category/:symbol', function (req, res) {

    let { category, symbol } = req.params

    category = specific_names[category] // special handling

    if (!category || !symbol)
      res.send(null)

    client.query(`SELECT * FROM v1_${category}_${symbol}_normalized;`, [], function(err, result) {

      if (err) {
        console.log(err)
        res.status(418).send(null)
      } else {
        res.send(result.rows)
      }

    })

  })

  const server = app.listen(8888, () => {
    const port = server.address().port
    console.log('Finance API server: Listening to port %s', port)
  })
}
