
// Load "mongoose" modules
const mongoose = require('mongoose');

// Specify your connection string to MongoDB
// Replace <username> and <password>
// Add dbName (name of your database) between / and ? if you want
const uri = '';

// Modelling your data via two ways:
// Way 1: building new scheme in server.js
// const kittySchema = new mongoose.Schema({
//   name: String,
// 	 age: Number
// });
// Way 2: invoking your scheme defined in kitty.js
const kittySchema = require('./models/kitty');

// Compile our schema into a Model. 
const Kitten = mongoose.model('Kitten', kittySchema);

async function main() {
  await mongoose.connect(uri);
  console.log('Mongoose Connected!')
  
  // Create a new document using the model
  const fluffy = new Kitten({name: 'fluffy', age: 5});
  console.log(fluffy);

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
