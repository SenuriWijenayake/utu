//Import the mongoose module
const mongoose = require('mongoose');
const moment = require('moment');
const Record = require('./record');

// Connecting to the mongodb database on localhost
mongoose.connect('mongodb://localhost:27017/utu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
mongoose.Promise = global.Promise;

/**
 * @description: Function to get all prices (today, yesterday, weekago, and monthago) for a specified currency on a given date
 * @params: currency (String), date (String, in MMM DD, YYYY format)
 * @returns: Nested object. Each object has four nested objects - one for each time period (today, yesterday, weekAgo, and monthAgo)
 */
exports.getStatsByCurrencyDate = function(currency, date) {
  // Parsing the string date, to a moment date object
  var date = moment(date, 'MMM DD, YYYY');
  var today = moment(date).format('MMM DD, YYYY');
  // Obtaining the other relevant date objects in the format required to run the query
  var yesterday = moment(date).subtract(1, 'days').format('MMM DD, YYYY');
  var weekAgo = moment(date).subtract(7, 'days').format('MMM DD, YYYY');
  var monthAgo = moment(date).subtract(1, 'months').format('MMM DD, YYYY');
  var days = [today, yesterday, weekAgo, monthAgo];

  // Creating the query to run on the database
  var query = {
    Date: days,
    Currency: currency
  };

  // Running the query as a promise. Removing the _id field and any other empty fields in the mongoose doc
  // Removing empty fields is necessary before iterating through the objects in convertToNumber function
  return new Promise(function(resolve, reject) {
    // This query returns four records that correspond to the four dates provided
    Record.find(query).select('-_id').lean().exec(function(err, records) {
      // Iterate through each doc, convert to relevant fields to float (using convertToNumber) and assign to the correct key in the final object
      var obj = {};
      for (var i = 0; i < records.length; i++) {
        if (records[i]['Date'] == today)
          obj.today = exports.convertToNumber(records[i]);
        if (records[i]['Date'] == yesterday)
          obj.yesterday = exports.convertToNumber(records[i]);
        if (records[i]['Date'] == weekAgo)
          obj.weekAgo = exports.convertToNumber(records[i]);
        if (records[i]['Date'] == monthAgo)
          obj.monthAgo = exports.convertToNumber(records[i]);
      }
      resolve(obj);
    });
  });
};

/**
 * @description: Function to get the full list of currencies available in the database
 * @returns: Array of currencies
 */
exports.getAllCurrencyTypes = function() {
  return new Promise(function(resolve, reject) {
    Record.distinct("Currency", function(err, currencies) {
      resolve(currencies);
    });
  });
};

/**
 * @description: Function to convert non-numeric values of the passed object to float (numeric) type
 * @param: Object with no empty fields
 * @returns: New object - where the Close, Open, High, Low, Volume and Market Cap values are in float
 */
exports.convertToNumber = function(obj) {
  var newObj = {};
  for (var key in obj) {
    // Captures the Close, Open, High, Low, Volume and Market Cap keys
    if (obj.hasOwnProperty(key) & key != "Currency" & key != "Date" & typeof(obj[key]) != "number") {
      // Remove the commas in the string values using regex
      newObj[key] = parseFloat((obj[key]).replace(/,/g, ''));
    } else {
       newObj[key] = obj[key];
     }
  }
  return newObj;
};
