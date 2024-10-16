const mongoose = require('mongoose');

const uri = ''
mongoose.connect(uri);

const kittySchema = require('./models/kitty');

// Compile our schema into a Model. 
const Kitten = mongoose.model('Kitten', kittySchema);

async function main() {
	await mongoose.connect(uri);
	console.log('Mongoose Connected!')

	// Search for all documents with the name field including "flu"
	const findresults = await Kitten.find({name: /^flu/});
	console.log(findresults);
  }
  
  main()
	.then(console.log('Find Kitten'))
	.catch((err) => console.log(err))
	.finally()
  