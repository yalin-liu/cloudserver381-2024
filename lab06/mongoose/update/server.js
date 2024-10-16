const mongoose = require('mongoose');
const uri = '';

const kittySchema = require('./models/kitty');

// Compile our schema into a Model. 
const Kitten = mongoose.model('Kitten', kittySchema);

async function main() {
	await mongoose.connect(uri);
	console.log('Mongoose Connected!')

	// Search for all documents with the name field including "fluffy"
	const findresults = await Kitten.findOne({name: "fluffy"});
	console.log(findresults);

	// Update the name then save to the mongodb
	findresults.name = "lion";
	const updateResult = await findresults.save();
	console.log(updateResult);
}
  
main()
	.then(console.log('Update Kitten'))
	.catch((err) => console.log(err))
	.finally()
  