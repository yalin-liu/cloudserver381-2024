const http = require('http'); 
const url  = require('url');
const fs   = require('fs');

const handle_incoming_request = (req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	var parsedURL = url.parse(req.url,true); // true to get query as object 
	
	if (parsedURL.query.fname) {
		console.log('Requested file: ' + parsedURL.query.fname);
		let fname = parsedURL.query.fname;
		fs.exists(fname, function(exists) {  // check if fname exists
			if (exists) {
				console.log('Opening file: ' + fname);
				fs.readFile(fname, function(err,data) {
					res.writeHead(200, {'Content-Type': 'image/jpeg'});
					res.end(data);
				}); // end fs.readFile()
			} // end if (exists)
			else {
				console.log('File not found: ' + fname);
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end('404 Not Found\n');
			}
		}) // end fs.exists()
	} // end if
	else {
		console.log('File name missing!');
		res.writeHead(422, {'Content-Type': 'text/plain'});
		res.write('File name missing\n');
		res.end('GET ?fname=ouhk-logo.jpg')
	}
}

const server = http.createServer(handle_incoming_request); 
server.listen(process.env.PORT || 8099);
