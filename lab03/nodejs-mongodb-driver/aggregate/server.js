const { MongoClient } = require("mongodb");
const dbName = 'test';
const uri = ``;
const collectionName = 'restaurants'

const aggregateRestaurants = (db, callback) => {
	try {
		let cursor = db.collection(collectionName).aggregate(
			[
				{ $group: { "_id": "$borough", "count": { $sum: 1 } } }
			]
		).toArray((err, results) => {
			callback(results);
		});
	} catch (err) {
		throw err
	}
};

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

try {
	client.connect(err => {
		const db = client.db(dbName)

		aggregateRestaurants(db, (docs) => {
			client.close(() => console.log(docs))
		})
	})
} catch (err) {
	console.error(err)
}