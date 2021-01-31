const db = require('./db/database');
const cNames = {
  "tezos": {
    "name": "Tezos",
    "abbr": "XTZ"
  },
  "bitcoin": {
    "name": "Bitcoin",
    "abbr": "BTC"
  },
  "bnb": {
    "name": "BNB",
    "abbr": "BNB"
  },
  "bitcoin-cash": {
    "name": "Bitcoin Cash",
    "abbr": "BCH"
  },
  "cardano": {
    "name": "Cardano",
    "abbr": "ADA"
  },
  "eos": {
    "name": "EOS",
    "abbr": "EOS"
  },
  "ethereum": {
    "name": "Ethereum",
    "abbr": "ETH"
  },
  "litecoin": {
    "name": "Litecoin",
    "abbr": "LTC"
  },
  "stellar": {
    "name": "Stellar",
    "abbr": "XLM"
  },
  "tether": {
    "name": "Tether",
    "abbr": "USDT"
  },
  "xrp": {
    "name": "XRP",
    "abbr": "XRP"
  }
};

/**
 * @description: Function to get the required price changes of all the currencies on a given date
 * @params: date (String, in MMM DD, YYYY format)
 * @returns: Array of objects. Each object has the name of the currency, the abbreviated form, the current price,
 * 24h change in price, 7d change in price, monthly change (in last 30 days) in price, 24h change in volume and the current market cap
 */
exports.getAllCurrencyPrices = function(date) {
  return new Promise(function(resolve, reject) {
    db.getAllCurrencyTypes().then(function(currencies) {
        var stats = [];
        //Creating a promises array
        var promises = [];
        for (var i = 0; i < currencies.length; i++) {
          promises.push(db.getStatsByCurrencyDate(currencies[i], date));
        }
        Promise.all(promises).then(function(data) {
            var final = [];
            for (var i = 0; i < data.length; i++) {
              // Setting up the expected object format for each currency
              var stats = {};
              stats.currency = cNames[data[i].today.Currency].name;
              stats.currencyAbbr = cNames[data[i].today.Currency].abbr;
              stats.price = data[i].today.Close;
              stats.daily = (data[i].today.Close - data[i].today.Open) / data[i].today.Open * 100;
              stats.weekly = (data[i].today.Close - data[i].weekAgo.Close) / data[i].weekAgo.Close * 100;
              stats.monthly = (data[i].today.Close - data[i].monthAgo.Close) / data[i].monthAgo.Close * 100;
              stats.volume = data[i].today.Volume - data[i].yesterday.Volume;
              stats.marketCap = data[i]['today']['Market Cap'];

              final.push(stats);
            }
            // Resolve the final object with all currencies
            resolve(final);
          })
          // Catch errors in getStatsByCurrencyDate function
          .catch(function(err) {
            reject(new Error("Error occured when fullfilling the promise array."));
          });
      })
      // Catch errors in getAllCurrencyTypes function
      .catch(function(err) {
        reject(new Error("Error occured when retrieving currency types."));
      });
  });
};
