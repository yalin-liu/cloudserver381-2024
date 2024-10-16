const mongoose = require('mongoose');

const kittySchema = new mongoose.Schema({
	name: String,
	age: Number
});

module.exports = kittySchema;
