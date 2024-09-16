const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const url = '';

const collectionName = 'restaurants'

const deleteRestaurants = async (db) => {
   var collection = db.collection(collectionName);
   const result = await collection.deleteOne({ "restaurant_id": "40362432" });
   return result;
}

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
		const results = await deleteRestaurants(db);
      console.log(`No. of document(s) deleted: ${results.deletedCount}`);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);