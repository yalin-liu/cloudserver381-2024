var mongoose = require('mongoose');

var publisherSchema = mongoose.Schema({
	id: mongoose.Schema.ObjectId,
	name: String,
	address: String,
	books: [{isbn: String,
	         title: String,
	         author: String,
			 price: Number,
	         stock: Number,
	         available: Boolean}]
});

module.exports = publisherSchema;
