const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const url = '';
const collectionName = 'restaurants';

const aggregateRestaurants = async (db) => {
	var collection = db.collection(collectionName);
	const result = await collection.aggregate([
		{ $match: { "borough": "Queens", "cuisine": "Brazilian" } },
		{ $group: { "_id": "$address.zipcode", "count": { $sum: 1 } } }
	]).toArray();

	/* Lets find which zipcode in Queens has the most number of Brazilian restaurants */
	let max = 0;
	let maxZip = '';
	result.forEach((x) => {
		if (x.count > max) {
			max = x.count;
			maxZip = x._id;
		}
	})

	return maxZip;
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
		const results = await aggregateRestaurants(db);
		console.log(`Zipcode ${results} in Queens has the most number of Brazilian restaurants`);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);
  
