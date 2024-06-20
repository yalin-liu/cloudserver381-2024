const { MongoClient, ServerApiVersion } = require("mongodb");
const collectionName = 'restaurants';
// Replace the uri string with your MongoDB deployment's connection string.
const url = '';

const replaceRestaurants = async (db) => {
   var collection = db.collection(collectionName);
   var result = await collection.replaceOne({ "restaurant_id": "30191841" }, { "name": "Unknown", "restaurant_id": "30191841" });
   return result;
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
	   const result = await replaceRestaurants(db);
      console.log(result);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);
  