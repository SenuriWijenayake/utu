const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const logic = require('./controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// To resolve the CORS error
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Server ready.')
})

app.listen(port, () => {
  console.log(`UTU app listening at http://localhost:${port}`)
})

/**
 * @description: API endpoint to retrieve prices of all currencies on a given date
 * @params: date (String, in MMM DD, YYYY format)
 * @returns: Array of objects. Each object has the name of the currency, the abbreviated form, the current price,
 * 24h change in price, 7d change in price, monthly change (in last 30 days) in price, 24h change in volume and the current market cap
 */
//To get data related to all currencies to populate the frontend
app.post('/prices', function(req, res) {
  console.log("At the /prices endpoint");
  return new Promise(function(resolve, reject) {
    var date = req.body.date;
    logic.getAllCurrencyPrices(date).then(function(obj) {
      resolve(res.status(200).send(obj));
    });
  });
});
