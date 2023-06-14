const mongoose = require('mongoose');
mongoose.connect('mongodb://',
				 {useMongoClient: true,}
);
const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
	let Kitten = mongoose.model('Kitten', kittySchema);
	let fluffy = new Kitten({name: 'fluffy', age: 0});

	fluffy.save((err) => {
		if (err) throw err
		console.log('Kitten created!')
		db.close();
	});
});
