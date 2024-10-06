const { MongoClient, ServerApiVersion } = require("mongodb");
const http = require('http');const url = require('url');
const qs = require ('querystring');const fs = require('fs');
const port = 8099; 
 
const uri = "";
const client = new MongoClient(uri); 
const dbName = 'test';
const collectionName = "bookings";

const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.find(criteria).toArray();
    return results;
}

//Complete the function.
const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionName);
    //let results = await ...;
    console.log("inserted one document " + JSON.stringify(results));
    return results;
}

//Complete the function.
const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    //let results = await ...;
    return results;
}

const handle_Find = async (res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);

    const docs = await findDocument(db, criteria);
    res.writeHead(200, {"content-type":"text/html"});
    res.write('<html><body>');
    if (docs.length > 0) {
        res.write('<ul>');
        for (var doc of docs) {
            res.write(`<li>Booking ID: ${doc.bookingid}, Mobile: ${doc.mobile}`);
        }
        res.write('</ul>');
    } else {
        res.write('<p>No data</p>');
    }
    res.end('</body></html>');
}

//Complete the function.
const handle_Insert = async (res,postdata) => {
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);

	 const docs = await insertDocument(db, postdata);
	 res.writeHead(200, {'Content-Type': 'text/html'}); 
	 res.write('<html>')        
	 //res.write(`Booking ID = ${...}`);
	 res.write('<br>')
	 //res.write(`Mobile Number = ${...}`);
	 res.write('<br>')
	 //res.write(`Successfully inserted: ${JSON.stringify(...)}`);
	 res.end('</html>')
}

//Complete the function.
const handle_Delete = async (res, criteria) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName); 

    const results = await deleteDocument(db, criteria);
    console.log("Closed DB connection");
    console.log(results);
    res.writeHead(200, {"content-type":"text/html"});
    res.write('<html><body>');
    //res.write(`Deleted documents having criteria ${JSON.stringify(...)}: ${results.deletedCount}`);
    res.end('</body></html>');
}

const server = http.createServer((req,res) => {
    var parsedURL = url.parse(req.url, true);
 	if (req.method == 'POST') {
		let data = '';  
		req.on('data', (payload) => {data += payload;});
	  	req.on('end', () => {  
			let postdata = qs.parse(data);
			handle_Insert(res,postdata)
				.then(console.log)
				.catch(console.dir)
				.finally(() => client.close());
		})
	} else {
		switch(parsedURL.pathname) {
			case '/':
				fs.readFile('book-insert.html', function (err, html) {if (err) {throw err; }
				res.writeHead(200, {"Content-Type": "text/html"});  
				res.write(html);  
				res.end(); })
				break;
			case '/find':
			    handle_Find(res, parsedURL.query)
					.then(console.log)
					.catch(console.dir)
					.finally(() => client.close());
			    break;
			case '/delete':
			    handle_Delete(res, parsedURL.query)
					.then(console.log)
					.catch(console.dir)
					.finally(() => client.close());
			    break;
			default:
			    res.writeHead(404, {'Content-Type': 'text/plain'});
			    res.end(`${parsedURL.pathname} - Unknown request!`);
			}
	}	    
})
 
server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); 
});
