var mongoose = require('mongoose');

var kittySchema = mongoose.Schema({
	name: String,
	age: Number
});

module.exports = kittySchema;
