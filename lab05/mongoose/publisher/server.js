const mongoose = require('mongoose');

const uri = ''
mongoose.connect(uri);

const publisherSchema = require('./models/publisher');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
	let Publisher = mongoose.model('Publisher', publisherSchema);
	try {
		let p = new Publisher({name: 'ABC', address: '30 Good Shepherd Street'});
		p.books.push({
			isbn: '01234567890ABC',
			title: 'Introduction to Node.JS',
			author: 'John Smith',
			price: 70.00,
			stock: 0,
			available: false
		});

		const insertResult = await p.save();
		console.log(insertResult)
	} catch (err) {
		console.error(err);
	} finally {
		db.close();
	}
});
