const expect = require('chai').expect
const db = require('../db/database')

describe('getAllCurrencyTypes', function() {
  it('is a function', () => {
    expect(db.getAllCurrencyTypes).to.be.a('Function');
  });

  it('returns a promise', () => {
    expect(db.getAllCurrencyTypes()).to.be.a('Promise');
  });

  it('returns an array of 11 with the expected currencies', () => {
    return db.getAllCurrencyTypes().then(function(data) {
      expect(data).to.be.an('Array');
      expect(data).to.have.length(11);
      expect(data).to.have.members(['tezos', 'bitcoin', 'stellar', 'tether', 'eos', 'bitcoin-cash', 'ethereum', 'bnb', 'cardano', 'litecoin', 'xrp']);
    });
  });
});

describe('convertInt', function() {
  var one = {
    "Currency": "tezos",
    "Date": "Dec 04, 2019",
    "Open": 1.29,
    "High": 1.32,
    "Low": 1.25,
    "Close": 1.25,
    "Volume": "46,048,752",
    "Market Cap": "824,588,509"
  };
  var two = {
    "Currency": "bitcoin",
    "Date": "Dec 04, 2019",
    "Open": "7,320.13",
    "High": "7,539.78",
    "Low": "7,170.92",
    "Close": "7,252.03",
    "Volume": "21,664,240,918",
    "Market Cap": "131,143,073,943"
  };
  var three = {
    "Currency": "bitcoin",
    "Date": "Dec 04, 2019",
    "Open": "343,546,768",
    "High": "423,453,566.123",
    "Low": "234,345,567",
    "Close": "343,546,323",
    "Volume": "46048752",
    "Market Cap": "824588509"
  };

  it('is a function', () => {
    expect(db.convertToNumber).to.be.a('Function');
  });

  it('returns an object, for all object formats', () => {
    expect(db.convertToNumber(one)).to.be.a('Object');
    expect(db.convertToNumber(two)).to.be.a('Object');
    expect(db.convertToNumber(three)).to.be.a('Object');
  });

  it('returns the expected object with correct numeric values, for all object formats', () => {
    var oneFormated = {
      "Currency": "tezos",
      "Date": "Dec 04, 2019",
      "Open": 1.29,
      "High": 1.32,
      "Low": 1.25,
      "Close": 1.25,
      "Volume": 46048752,
      "Market Cap": 824588509
    };
    var twoFormated = {
      "Currency": "bitcoin",
      "Date": "Dec 04, 2019",
      "Open": 7320.13,
      "High": 7539.78,
      "Low": 7170.92,
      "Close": 7252.03,
      "Volume": 21664240918,
      "Market Cap": 131143073943
    };
    var threeFormated = {
      "Currency": "bitcoin",
      "Date": "Dec 04, 2019",
      "Open": 343546768,
      "High": 423453566.123,
      "Low": 234345567,
      "Close": 343546323,
      "Volume": 46048752,
      "Market Cap": 824588509
    };

    expect(db.convertToNumber(one)).to.eql(oneFormated);
    expect(db.convertToNumber(two)).to.eql(twoFormated);
    expect(db.convertToNumber(three)).to.eql(threeFormated);
  });

});


describe('getStatsByCurrencyDate', function() {
  var currency = "bitcoin";
  var date = "Dec 04, 2019";

  it('is a function', () => {
    expect(db.getStatsByCurrencyDate).to.be.a('Function');
  });
  it('returns a promise', () => {
    expect(db.getStatsByCurrencyDate(currency, date)).to.be.a('Promise');
  });

  it('returns an object with the right keys', () => {
    return db.getStatsByCurrencyDate(currency, date).then(function(data) {
      expect(data).to.be.an('Object');
      expect(data).to.have.keys(['today', 'yesterday', 'weekAgo', 'monthAgo']);
      expect(data['today']).to.be.an('Object');
    });
  });
});
