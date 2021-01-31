// const assert = require('assert');
const expect = require('chai').expect
const sinon = require('sinon')
const logic = require('../controller')
const db = require('../db/database')

describe('getAllCurrencyPrices', function() {
  var date = 'Dec 04, 2019';
  var getAllCurrencyTypes, getStatsByCurrencyDate;

  before(function() {
    getAllCurrencyTypes = sinon.stub(db, 'getAllCurrencyTypes').resolves(['tezos', 'bitcoin', 'stellar', 'tether', 'eos', 'bitcoin-cash', 'ethereum', 'bnb', 'cardano', 'litecoin', 'xrp']);
    getStatsByCurrencyDate = sinon.stub(db, 'getStatsByCurrencyDate').resolves({
      today: {
        Currency: 'tezos',
        Date: 'Dec 04, 2019',
        Open: 1.29,
        High: 1.32,
        Low: 1.25,
        Close: 1.25,
        Volume: 46048752,
        'Market Cap': 824588509
      },
      yesterday: {
        Currency: 'tezos',
        Date: 'Dec 03, 2019',
        Open: 1.24,
        High: 1.32,
        Low: 1.21,
        Close: 1.29,
        Volume: 41462224,
        'Market Cap': 853213342
      },
      weekAgo: {
        Currency: 'tezos',
        Date: 'Nov 27, 2019',
        Open: 1.24,
        High: 1.27,
        Low: 1.16,
        Close: 1.26,
        Volume: 47723271,
        'Market Cap': 829672736
      },
      monthAgo: {
        Currency: 'tezos',
        Date: 'Nov 04, 2019',
        Open: 0.868023,
        High: 0.907127,
        Low: 0.8646,
        Close: 0.891802,
        Volume: 16511023,
        'Market Cap': 588922638
      }
    });
  });

  after(function() {
    db.getAllCurrencyTypes.restore();
    db.getStatsByCurrencyDate.restore();
  });

  it('is a function', () => {
    expect(logic.getAllCurrencyPrices).to.be.a('Function');
  });

  it('returns a promise', () => {
    expect(logic.getAllCurrencyPrices(date)).to.be.a('Promise');
  });

  it('returns an array of 11 objects', () => {
    return logic.getAllCurrencyPrices(date).then(function(data) {
      expect(data).to.be.an('Array');
      expect(data).to.have.length(11);
      expect(data[0]).to.be.an('Object');
    });
  });

  it('returns the correct values for the variables', () => {
    return logic.getAllCurrencyPrices(date).then(function(data) {
      var d = data[0];
      expect(d.currency).to.equal('Tezos');
      expect(d.currencyAbbr).to.equal('XTZ');
      expect(d.price).to.equal(1.25);
      expect(d.daily).to.equal((1.25 - 1.29) / 1.29 * 100);
      expect(d.weekly).to.equal((1.25 - 1.26) / 1.26 * 100);
      expect(d.monthly).to.equal((1.25 - 0.891802) / 0.891802 * 100);
      expect(d.volume).to.equal(46048752 - 41462224);
      expect(d.marketCap).to.equal(824588509);
    });
  });
});

describe('getAllCurrencyPrices - handling errors in getAllCurrencyTypes', function() {
  var date = 'Dec 04, 2019';
  var getAllCurrencyTypes, getStatsByCurrencyDate;

  before(function() {
    getAllCurrencyTypes = sinon.stub(db, 'getAllCurrencyTypes').rejects(new Error('Stubbed Error'));
    getStatsByCurrencyDate = sinon.stub(db, 'getStatsByCurrencyDate').resolves({
      today: {
        Currency: 'tezos',
        Date: 'Dec 04, 2019',
        Open: 1.29,
        High: 1.32,
        Low: 1.25,
        Close: 1.25,
        Volume: 46048752,
        'Market Cap': 824588509
      },
      yesterday: {
        Currency: 'tezos',
        Date: 'Dec 03, 2019',
        Open: 1.24,
        High: 1.32,
        Low: 1.21,
        Close: 1.29,
        Volume: 41462224,
        'Market Cap': 853213342
      },
      weekAgo: {
        Currency: 'tezos',
        Date: 'Nov 27, 2019',
        Open: 1.24,
        High: 1.27,
        Low: 1.16,
        Close: 1.26,
        Volume: 47723271,
        'Market Cap': 829672736
      },
      monthAgo: {
        Currency: 'tezos',
        Date: 'Nov 04, 2019',
        Open: 0.868023,
        High: 0.907127,
        Low: 0.8646,
        Close: 0.891802,
        Volume: 16511023,
        'Market Cap': 588922638
      }
    });
  });

  after(function() {
    db.getAllCurrencyTypes.restore();
    db.getStatsByCurrencyDate.restore();
  });

  it('is a function', () => {
    expect(logic.getAllCurrencyPrices).to.be.a('Function');
  });

  it('returns a promise with an Error object', () => {
    expect(logic.getAllCurrencyPrices(date)).to.be.a('Promise');
  });

  it('catches and returns an Error object', () => {
    return logic.getAllCurrencyPrices(date).catch(function(err) {
      expect(err).to.be.an('Error');
      expect(err.message).to.equal('Error occured when retrieving currency types.');
    });
  });
});

describe('getAllCurrencyPrices - handling errors in getStatsByCurrencyDate', function() {
  var date = 'Dec 04, 2019';
  var getAllCurrencyTypes, getStatsByCurrencyDate;

  before(function() {
    getAllCurrencyTypes = sinon.stub(db, 'getAllCurrencyTypes').resolves(['tezos', 'bitcoin', 'stellar', 'tether', 'eos', 'bitcoin-cash', 'ethereum', 'bnb', 'cardano', 'litecoin', 'xrp']);
    getStatsByCurrencyDate = sinon.stub(db, 'getStatsByCurrencyDate').rejects(new Error("Stubbed Error"));
  });

  after(function() {
    db.getAllCurrencyTypes.restore();
    db.getStatsByCurrencyDate.restore();
  });

  it('is a function', () => {
    expect(logic.getAllCurrencyPrices).to.be.a('Function');
  });

  it('returns a promise with an Error object', () => {
    expect(logic.getAllCurrencyPrices(date)).to.be.a('Promise');
  });

  it('catches and returns an Error object', () => {
    return logic.getAllCurrencyPrices(date).catch(function(err) {
      expect(err).to.be.an('Error');
      expect(err.message).to.equal('Error occured when fullfilling the promise array.');
    });
  });
});
