const mongoose = require('mongoose');
mongoose.connect('',
				 {useMongoClient: true,}
);

const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
	let Kitten = mongoose.model('Kitten', kittySchema);

	Kitten.findOne({name: "fluffy"}, (err,result) => {
		if (err) return console.error(err);
		console.log(result);	
		result.name = "lion";
		result.save((err) => {
			if (err) throw err
			console.log("Name changed");
			db.close();
		});
	});
});
