const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.Promise = require('bluebird');

const uri = ''
mongoose.connect(uri);

const kittySchema = require('./models/kitty');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',async  (callback) => {
	let Kitten = mongoose.model('Kitten', kittySchema);
	let fluffy = new Kitten({name: 'fluffy', age: 90});

	try {
		await fluffy.validate();
		const insertResult = await fluffy.save();
		console.log('Kitten created!')
	} catch (err) {
		console.error(err)
	} finally {
		db.close()
	}

	// fluffy.validate((err) => {
   	// 	console.log(err);
	// });

	// fluffy.save((err) => {
	// 	if (err) throw err
	// 	console.log('Kitten created!')
	// 	db.close();
	// });
});
