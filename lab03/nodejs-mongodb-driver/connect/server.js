const { MongoClient } = require("mongodb");
const dbName = "test";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

try {
   client.connect(err => {
      const db = client.db(dbName)

      db.command({ ping: 1 }, () => {
         client.close(() => console.log(`connected to Mongodb server.`))
      })
   })
} catch (err) {
   console.error(err)
}