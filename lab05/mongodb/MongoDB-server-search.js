const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');
const mongourl = '';
const dbName = 'test';

const findRestaurants = (db, criteria, callback) => {
	restaurants = [];
	if (criteria != null) {
   		var cursor = db.collection('restaurants').find(criteria);
	}
	else {
		var cursor = db.collection('restaurants').find();
	}
	cursor.toArray((err,docs) => {
		assert.equal(err,null);
		callback(docs);
	})
};

const findDistinctBorough = (db, callback) => {
	db.collection('restaurants').distinct("borough", (err,docs) => {
		console.log(docs);
		callback(docs);
	});
}

const server = http.createServer(function (req,res) {
	var today = new Date();

	console.log(today.toTimeString() + " " +
	            "INCOMING REQUEST: " + req.connection.remoteAddress + " " +
	            req.method + " " + req.url);

	var parsedURL = url.parse(req.url,true); //true to get query as object

	if (parsedURL.pathname == '/search') {
		const client = new MongoClient(mongourl);
		client.connect((err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			findRestaurants(db, parsedURL.query, (restaurants) => {
				client.close();
            	console.log("Closed DB connection");
				res.writeHead(200, {"Content-Type": "application/json"});
				res.write(JSON.stringify(restaurants));
				res.end();
				console.log(today.toTimeString() + " " + "CLOSED CONNECTION "
				            + req.connection.remoteAddress);
  			});
		});
	}
	else if (parsedURL.pathname == "/") { // display HTML form
		const client = new MongoClient(mongourl);
		client.connect((err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
  			findDistinctBorough(db, (boroughs) => {
				client.close();
            	console.log("Closed DB connection");
				res.writeHead(200, {"Content-Type": "text/html"});
				//res.write(JSON.stringify(boroughs));
				res.write("<html><body>");
				res.write("<form action=\"/search\" method=\"get\">");
				res.write("Borough: ");
				res.write("<select name=\"borough\">");
				for (i in boroughs) {
					res.write("<option value=\"" +
						boroughs[i] + "\">" + boroughs[i] + "</option>");
				}
				res.write("</select>");
				res.write("<input type=\"submit\" value=\"Search\">");
				res.write("</form>");
				res.write("</body></html>");
				res.end();
				console.log(today.toTimeString() + " " + "CLOSED CONNECTION "
				            + req.connection.remoteAddress);
  			});
		});
	}
	else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.write("404 Not Found\n");
		res.end();
	}
});

server.listen(process.env.PORT || 8099);