const { MongoClient, ServerApiVersion } = require("mongodb");
const url = '';  // MongoDB Atlas Connection URL
const collectionName = 'restaurants'

const aggregateRestaurants = async (db) => {
	var collection = db.collection(collectionName);

	var condition = [
		{ $group: { "_id": "$borough", "count": { $sum: 1 } } }
	];

	const result = await collection.aggregate(condition).toArray(); 
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
		const result = await aggregateRestaurants(db);
		console.log("Result: ", result);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);
  