const mongoose = require('mongoose');
mongoose.connect('mongodb://',
				 {useMongoClient: true,}
);

const publisherSchema = require('./models/publisher');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
	let Publisher = mongoose.model('Publisher', publisherSchema);

	let p = new Publisher({name: 'ABC', address: '30 Good Shepherd Street'});
	p.books.push({isbn: '01234567890ABC',
	              title: 'Introduction to Node.JS',
	              author: 'John Smith',
	              price: 70.00,
	              stock: 0,
				  available: false
	});

	p.save((err) => {
		if (err) throw err
		console.log('Publisher created!')
		db.close();
	});
});
