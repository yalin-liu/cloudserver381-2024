var mongoose = require('mongoose');

var kittySchema = mongoose.Schema({
	name: String,
	age: {type: Number, min: 0, max: 20}
});

module.exports = kittySchema;
