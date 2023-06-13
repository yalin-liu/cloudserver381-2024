const { MongoClient } = require("mongodb");
const dbName = "test";
const collectionName = 'restaurants'
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const findRestaurants = (db, callback) => {
   let cursor = db.collection(collectionName).find({ "borough": "Manhattan" }).limit(10);
   cursor.toArray((err, results) => {
      callback(results);
   })
}

try {
   client.connect(err => {
      const db = client.db(dbName)

      findRestaurants(db, (results) => {
         client.close(() => console.log(results));
      })
   })
} catch (err) {
   console.error(err)
}