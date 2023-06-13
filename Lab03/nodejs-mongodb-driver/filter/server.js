const { MongoClient } = require("mongodb");
const dbName = "test";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ``;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const collectionName = 'restaurants'

try {
	client.connect(err => {
		const db = client.db(dbName)

		aggregateRestaurants(db, (results) => {
			client.close(() => console.log(`Zipcode ${results} in Queens has the most number of Brazilian restaurants`));
		})
	})
} catch (err) {
	console.error(err)
}

const aggregateRestaurants = (db, callback) => {
	var cursor = db.collection(collectionName).aggregate(
		[
			{ $match: { "borough": "Queens", "cuisine": "Brazilian" } },
			{ $group: { "_id": "$address.zipcode", "count": { $sum: 1 } } }
		]
	).toArray((err, result) => {
		/*
		* Lets find which zipcode in Queens has the most number of Brazilian restaurants
		*/
		let max = 0;
		let maxZip = '';
		result.forEach((x) => {
			if (x.count > max) {
				max = x.count;
				maxZip = x._id;
			}
		})
		callback(maxZip);
	});
};

