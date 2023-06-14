const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
const assert = require('assert');
const kittySchema = require('./models/kitty');

// View
const renderResult = (res,kitties) => {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write('<html><body>');
	res.write('<H2>Details of all Kitties:</H2>');
	res.write('<ol>');
	for (var i = 0; i < kitties.length; i++) {
		res.write('<li>');
		res.write(JSON.stringify(kitties[i]));
		res.write('</li>')
	}
	res.write('</ol>');
	res.write('</H2>');
	res.write('</body></html>');
}

// Controller
const filterResult = (id) => {
	fields = (id == "admin") ? "name age -_id" : "name -_id";
	return(fields);
}

const server = http.createServer((req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	var parsedURL = url.parse(req.url,true); // true to get query as object 

	if (parsedURL.pathname == '/show') {
		var fields = filterResult(parsedURL.query.id);
		const db = mongoose.connection;
		mongoose.connect('mongodb://',
			{useMongoClient: true}
		);
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open',()=> {
			const Kitten = mongoose.model('Kitten', kittySchema);
			Kitten.find({},fields,function(err,results) {
				assert.equal(err,null);
				db.close();
				renderResult(res,results);
				res.end();
			})
		});
	}
	else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.write("404 Not Found\n");
		res.end();
	}
});

server.listen(process.env.PORT || 8099);
