const { MongoClient, ServerApiVersion } = require("mongodb");
const mongourl = '';
const dbName = 'test';
const collectionName = "bookings";
 
const criteria = {"bookingid": "1111"};
const changes = {"mobile": "87654321"}

const updateManyDocument = async (db) => {
    var collection = db.collection(collectionName);
    let results = await collection.updateMany(criteria, {$set: changes});
    return results;
}

async function main() {
	// invoking the const MongoCLient, the first executable statement
	const client = new MongoClient(mongourl, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		}
	});

	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		// Send a ping to confirm a successful connection
		const pingResult = await client.db("admin").command({ ping: 1 });
		console.log("Ping Result >>>>>> ", pingResult);
		console.log("Pinged your deployment. You successfully connected to MongoDB!");

		const db = client.db(dbName);
		const results = await updateManyDocument(db);
        console.log(results);
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);