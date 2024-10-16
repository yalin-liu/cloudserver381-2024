const mongoose = require('mongoose');

const uri = '';
const kittySchema = require('./models/kitty');

// Compile our schema into a Model. 
const Kitten = mongoose.model('Kitten', kittySchema);

async function main() {
  await mongoose.connect(uri);
  console.log('Mongoose Connected!')

  // Create a new document using the model
  const fluffy = new Kitten({name: 'fluffy', age: 21});
  console.log(fluffy);

  // Validate the object
  await fluffy.validate();

  // Save the created document to your MongoDB 
  await fluffy.save();

  // Search for all documents from your MongoDB > the kittens collections
  const kittens = await Kitten.find();
  console.log(kittens);

  // Search for all documents with the name field including "fluff"
  const findresults = await Kitten.find({ name: /^fluff/ });
  console.log(findresults);
}

main()
  .then(console.log('Kitten created'))
  .catch((err) => console.log(err))
  .finally()
