const http = require('http');
const url  = require('url');

const greetingMsg = (name = null, includeTime = false) => {
	let today = new Date();
	let msg = (name != null) ? 'Hello ' + name + '! ' : 'Hello there!';
	if (includeTime) {
	  msg += `  It is now ${today.toTimeString()}`;
	  msg = `<html><head><title>sayHello</title></head><body><H1>${msg}</H1></body><html>`;
	}
	return (msg);
  }

const server = http.createServer(function (req,res) {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	const parsedURL = url.parse(req.url,true); //true to get query as object

	switch(parsedURL.pathname) {
		case '/':
		case '/greetings':
		case '/greetings/sayHello':
		case '/greetings/sayHelloWithTime':
			res.writeHead(200, {"Content-Type" : "text/html"});

			if (parsedURL.pathname == '/greetings/sayHelloWithTime') {
				res.write(greetingMsg(parsedURL.query.name,true));
			} else {
				res.write(greetingMsg(parsedURL.query.name,false));
			}
			res.end();
			break;
		default:
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("404 Not Found\n");
	}
});

server.listen(process.env.PORT || 8099);
