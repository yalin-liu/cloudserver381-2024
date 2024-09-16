const http = require('http');
const url  = require('url');

const server = http.createServer(function (req,res) {
	var greetingMsg = "Hello there!";

	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	const parsedURL = url.parse(req.url,true); //true to get query as object

	if (parsedURL.query.name) {
		greetingMsg = `Hello ${parsedURL.query.name}`;
	}

	switch(parsedURL.pathname) {
		case '/greetings':
		case '/greetings/sayHello':
		case '/greetings/sayHelloWithTime':
			res.writeHead(200, {"Content-Type" : "text/html"});
			res.write('<html><head><title>sayHello</title></head>');
			res.write('<body><H1>' + greetingMsg + '</H1>');

			if (parsedURL.pathname == '/greetings/sayHelloWithTime') {
				var today = new Date();
				res.write('<p>It is now ' + today.toTimeString() + '</p>');
			}
			res.end('</body></html>');
			break;
		default:
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("404 Not Found\n");
	}
});

server.listen(process.env.PORT || 8099);
