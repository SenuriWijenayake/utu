var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defining a mongoose schema for records
var recordSchema = new Schema({
  Currency : String,
  Date : String,
  Open: Schema.Types.Mixed, // Could be either String or Number in the database
  High: Schema.Types.Mixed,
  Low : Schema.Types.Mixed,
  Close : Schema.Types.Mixed,
  Volume: String,
  "Market Cap" : String // To match with the key name in the database
});

// Connecting te defined schema to Record model to be accessed in the controller
var Record = mongoose.model('Record', recordSchema);

module.exports = Record;
