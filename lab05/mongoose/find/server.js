const mongoose = require('mongoose');
mongoose.connect('mongodb://',
				 {useMongoClient: true,}
);

const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	let Kitten = mongoose.model('Kitten', kittySchema);

	Kitten.find({name: /^flu/}, (err,results) => {
		if (err) return console.error(err);
		console.log(results);
		db.close();
	});
});
