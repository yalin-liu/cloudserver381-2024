const { MongoClient, ServerApiVersion } = require("mongodb");
const collectionName = 'books';
// Replace the uri string with your MongoDB deployment's connection string.
const url = '';

const insertDocument = async (db) => {
  var collection = db.collection(collectionName);
  var results = await collection.insertOne({
    "name": "Introduction to Node.js",
    "author": "John Dole",
    "price": 75.00,
    "stock": 0
  });
  return results;
};

async function main() {
	// invoking the const MongoCLient, the first executable statement
	const client = new MongoClient(url, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		}
	});

	// Database Name
	const dbName = 'test';

	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		// Send a ping to confirm a successful connection
		const pingResult = await client.db("admin").command({ ping: 1 });
		console.log("Ping Result >>>>>> ", pingResult);
		console.log("Pinged your deployment. You successfully connected to MongoDB!");

		const db = client.db(dbName);
		const results = await insertDocument(db);
    console.log(`Inserted 1 document (_id: ${results.insertedId}) into the ${collectionName} collection.`);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);
  