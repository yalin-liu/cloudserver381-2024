const { MongoClient } = require("mongodb");
const dbName = "test";
const collectionName = 'restaurants'
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

try {
   client.connect(err => {
      const db = client.db(dbName)

      updateRestaurants(db, (results) => {
         // console.log(results)
         if (results.modifiedCount == 1) {
            console.log('Update was succesful');
         } else {
            console.log('Update failed!!');
         }
      })
   })
} catch (err) {
   console.error(err)
}

const updateRestaurants = (db, callback) => {
   db.collection(collectionName)
      .updateOne(
         { "restaurant_id": "41156888" },
         { $set: { "address.street": "East 31st Street" } }, (err, results) => {
            client.close(() => callback(results));
         });
};
