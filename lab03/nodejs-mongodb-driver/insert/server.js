const { MongoClient } = require("mongodb");
const dbName = "test";
const collectionName = 'books'
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertDocument = (db, callback) => {
  db.collection(collectionName).insertOne({
    "name": "Introduction to Node.js",
    "author": "John Dole",
    "price": 75.00,
    "stock": 0
  }, (err, results) => {
    callback(results);
  });
};

try {
  client.connect(err => {
    const db = client.db(dbName)

    insertDocument(db, (results) => {
      client.close(() => console.log(`Inserted ${results.insertedCount} document (_id: ${results.insertedId}) into the ${collectionName} collection.`));
    })
  })
} catch (err) {
  console.error(err)
}
