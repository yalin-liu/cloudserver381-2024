const { MongoClient, ServerApiVersion } = require("mongodb");
const http = require('http');
const url = require('url');
const mongourl = '';
const dbName = 'test';
const collectionName = "restaurants";
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const findRestaurants = async (db, criteria, callback) => {
	let restaurants = [];
	let collection = db.collection(collectionName);
	if (criteria != null) {
   		restaurants = await collection.find(criteria).toArray();
	} else {
		restaurants = await collection.find().toArray();
	}
	return restaurants;
};

const findDistinctBorough = async (db, callback) => {
	const collection = db.collection(collectionName);
	const criteria = [
		{ $group: { _id: "$borough" } },
		// { $sort: { _id: 1 } } // Optional, sorts the results alphabetically
	];
    let results = await collection.aggregate(criteria).toArray();
	return results.map(item => item._id).filter(borough => borough !== null);
}

const siteRouter = async (req, res, parsedURL, today) => {
	try {
		await client.connect();
		const db = client.db(dbName);

		if (parsedURL.pathname == '/search') {
			const restaurants = await findRestaurants(db, parsedURL.query);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(JSON.stringify(restaurants));
			res.end();
		} else if (parsedURL.pathname == "/") { // display HTML form
			const boroughs = await findDistinctBorough(db);
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write("<html><body>");
			res.write("<form action=\"/search\" method=\"get\">");
			res.write("Borough: ");
			res.write("<select name=\"borough\">");
			for (i in boroughs) {
				res.write("<option value=\"" + boroughs[i] + "\">" + boroughs[i] + "</option>");
			}
			res.write("</select>");
			res.write("<input type=\"submit\" value=\"Search\">");
			res.write("</form>");
			res.write("</body></html>");
			res.end();
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
		}
	} catch (err) {
		console.error(err);
	} finally {
		await client.close();
		console.log(today.toTimeString() + " " + "CLOSED CONNECTION " + req.connection.remoteAddress);
	}
}

const server = http.createServer(function (req,res) {
	var today = new Date();

	console.log(today.toTimeString() + " " +
	            "INCOMING REQUEST: " + req.connection.remoteAddress + " " +
	            req.method + " " + req.url);

	var parsedURL = url.parse(req.url,true); //true to get query as object
	siteRouter(req, res, parsedURL, today);
});

server.listen(process.env.PORT || 8099);