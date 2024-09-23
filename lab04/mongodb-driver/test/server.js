const { MongoClient, ServerApiVersion } = require('mongodb');
const url = '';  
const client = new MongoClient(url);
const dbName = '';
const collectionName = '';

const countRestaurants = async (db) => {
	var collection = db.collection(collectionName);
	const count = await collection.countDocuments();
	console.log(`There are ${count} documents in the ${collectionName} collection of the ${dbName} datababe.`);
}

async function main() {
    await client.connect();	
    console.log("You successfully connected to MongoDB!");
    const db = client.db(dbName);
    await countRestaurants(db);
}

main()
  .then(console.log("Running your MongoDB-driver! ------Alin (This is an async running result.)"))
  .catch(console.error)
  .finally(() => client.close());
