const mongoose = require('mongoose');

const uri = '';
// mongoose.connect(uri);

const publisherSchema = require('./models/publisher');

// Compile our schema into a Model. 
const Publisher = mongoose.model('Publisher', publisherSchema);

async function main() {
	await mongoose.connect(uri);
	console.log('Mongoose Connected!')
	
	// Create a new document using the model
	let publisherObj = new Publisher({name: '381 books', address: '30 Good Shepherd Street'});
	publisherObj.books.push({
		isbn: '01234567890ABC',
		title: 'Introduction to Node.JS',
		author: 'John Smith',
		price: 70.00,
		stock: 0,
		available: false
	});
	console.log(publisherObj);
  
	// Save the created document to your MongoDB 
	const insertResult = await publisherObj.save();
	console.log(insertResult);
}
  
main()
	.then(console.log('Insert Publisher'))
	.catch((err) => console.log(err))
	.finally()
  
