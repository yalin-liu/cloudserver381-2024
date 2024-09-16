const { MongoClient, ServerApiVersion } = require("mongodb");
const collectionName = 'restaurants'
// Replace the uri string with your MongoDB deployment's connection string.
const url = '';

const updateRestaurants = async (db) => {
   var collection = db.collection(collectionName);
   const results = await collection.updateOne(
      { "restaurant_id": "30191841" },
      { $set: { "address.street": "East 31st Street" } }
   );
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
		const results = await updateRestaurants(db);
      if (results.modifiedCount == 1) {
         console.log('Update was succesful');
      } else {
         console.log('Update failed!!');
      }
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
main().catch(console.dir);
  