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

      findRestaurants(db, (docs) => {
         client.close(() => console.log(docs));
      })
   })
} catch (err) {
   console.error(err)
}

const findRestaurants = (db, callback) => {
   let cursor = db.collection(collectionName)
      .find()
      .sort({ "borough": 1, "address.zipcode": 1 })
      .limit(10);
   cursor.toArray((err, results) => {
      callback(results);
   });
};
