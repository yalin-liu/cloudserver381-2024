// Load "mongoose" modules
const mongoose = require('mongoose');

// Fill in uri connected to MongoDB, the same uri used in the mongodb driver
const uri = '';

// Data modelling 
// Way 1: building a new scheme in server.js
// const kittySchema = new mongoose.Schema({name: String, age: Number});
// Way 2: invoking your scheme defined in kitty.js 
// const kittySchema = require('./models/kitty’);

async function main() {
  await mongoose.connect(uri);
  console.log('Mongoose Connected!')
  // do some data operations
}

main()
  .then(console.log('Kitten created'))
  .catch((err)=>console.log(err))
  .finally()
