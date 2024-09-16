const mongoose = require('mongoose');
const uri = ''
mongoose.connect(uri);

const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
	let Kitten = mongoose.model('Kitten', kittySchema);
	try {
		let searchResult = await Kitten.findOne({name: "fluffy"}).exec();
		console.log(searchResult);

		searchResult.name = "lion";
		const updateResult = await searchResult.save();
		console.log(updateResult);
	} catch (err) {
		console.error(err);
	} finally {
		db.close();
	}
});
