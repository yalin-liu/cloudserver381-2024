const { MongoClient } = require("mongodb");
const dbName = "test";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
const collectionName = 'restaurants'

const deleteRestaurants = (db, callback) => {
   db.collection(collectionName).deleteOne(
      { "restaurant_id": "41156888" },
      (err, results) => {
         if (err) throw err;
         callback(results.deletedCount);
      }
   );
}

try {
   client.connect(err => {
      const db = client.db(dbName)

      deleteRestaurants(db, (results) => {
         client.close(() => console.log(`No. of document(s) deleted: ${results}`));
      })
   })
} catch (err) {
   console.error(err)
}


