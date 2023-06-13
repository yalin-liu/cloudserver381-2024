const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = '';  // MongoDB Atlas Connection URL
const dbName = 'test'; // Database Name

const countRestaurants = function(db, callback) {
	var collection = db.collection('restaurants');
	collection.countDocuments(function(err,count) { //`countdocuments` operation in MongoDB
		assert.equal(null,err);
		console.log(`There are ${count} documents in the restuarant collection`);
	})
	callback();
}

const client = new MongoClient(url); // invoking the const MongoCLient, the first executable statement

client.connect(function(err) {
   assert.equal(null,err);
   console.log(`Connected successfully to ${url}`);

   const db = client.db(dbName);

   countRestaurants(db, function() {
	client.close();
   })
})
