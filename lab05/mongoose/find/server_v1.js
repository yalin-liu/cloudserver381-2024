const mongoose = require('mongoose');

const uri = ''
mongoose.connect(uri);

const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
	let Kitten = mongoose.model('Kitten', kittySchema);

	try {
		const searchResult = await Kitten.find({name: /^flu/}).exec();
		console.log(searchResult)
	} catch (err) {
		console.error(err);
	} finally {
		db.close();
	}
});
