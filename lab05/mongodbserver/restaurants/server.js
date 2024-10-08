const { MongoClient, ServerApiVersion } = require("mongodb");
const http = require('http');
const url = require('url');
const port = 8099; 

const uri = "";
const client = new MongoClient(uri); 
const dbName = 'sample_restaurants';
const collectionName = "restaurants";

//Complete the function.
const findRestaurants = async (db, criteria) => {
	let restaurants = [];
	//let collection = db.collection(...);
	if (criteria != null) {
   		//restaurants = await collection.find(...).toArray();
	} else {
		restaurants = await collection.find().toArray();
	}
	return restaurants;
};

const findDistinctBorough = async (db) => {
	const collection = db.collection(collectionName);
	const criteria = [
		{ $group: { _id: "$borough" } },
		// { $sort: { _id: 1 } } // Optional, sorts the results alphabetically
	];
    let results = await collection.aggregate(criteria).toArray();
	return results.map(item => item._id).filter(borough => borough !== null);
}

const siteRouter = async (req, res, parsedURL, today) => {
	await client.connect();
	const db = client.db(dbName);

	if (parsedURL.pathname == '/show_rname') {
		const restaurants = await findRestaurants(db, parsedURL.query);
		// console.log(restaurants)

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write('<html><body><ul>');
		for (const r of restaurants) {
			res.write(`<li>${r.name}</li>`);
		}
		res.end('</ul></body></html>');
	} else if (parsedURL.pathname == "/") { // display HTML form
		const boroughs = await findDistinctBorough(db);
		// console.log(boroughs);

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<html><body>");
		res.write("<form action=\"/show_rname\" method=\"get\">");
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
}

const server = http.createServer( (req,res) => {
	var today = new Date();

	console.log(today.toTimeString() + " " +
	            "INCOMING REQUEST: " + req.connection.remoteAddress + " " +
	            req.method + " " + req.url);

	var parsedURL = url.parse(req.url,true); //true to get query as object
	siteRouter(req, res, parsedURL, today)
		.then(console.log)
		.catch(console.dir)
		.finally(() => client.close());
// console.log(today.toTimeString() + " " + "CLOSED CONNECTION " + req.connection.remoteAddress)
});

server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); 
});
