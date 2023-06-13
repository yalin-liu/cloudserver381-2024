const { MongoClient } = require("mongodb");
const dbName = "test";
const collectionName = 'restaurants'
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const replaceRestaurants = (db, callback) => {
   db.collection(collectionName)
      .replaceOne(
         { "restaurant_id": "41156888" },
         { "name": "Unknown" },
         (err, results) => {
            callback(results);
         });
};

try {
   client.connect(err => {
      const db = client.db(dbName)

      replaceRestaurants(db, (results) => {
         client.close(() => console.log(results));
      })
   })
} catch (err) {
   console.error(err)
}
