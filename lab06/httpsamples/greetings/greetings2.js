const http = require('http');
const url  = require('url');
const qs = require('querystring');

const server = http.createServer(function (req,res) {
	var greetingMsg = "Hello there!";

	var timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	const parsedURL = url.parse(req.url,true); //true to get query as object

	switch(parsedURL.pathname) {
		case '/greetings':
		case '/greetings/sayHello':
		case '/greetings/sayHelloWithTime':
			switch(req.method) {
				case 'GET':
					if (parsedURL.query.name) {
						greetingMsg = `Hello ${parsedURL.query.name}`;
					}
					sayHello(res,greetingMsg,parsedURL);
					break;
				case 'POST':
					let data = '';
					req.on('data', (payload) => {
						data += payload;
					}); // end req.on()
					req.on('end', () => {
						// parse query string such as id=1080&name=raymond
						console.log("POST Data: " + data);
						let qsvars = data.split('&');
						for (var i = 0; i < qsvars.length; i++) {
							let nvpair = qsvars[i].split('=');
							if (nvpair[0] == "name") {
								greetingMsg = `Hello ${nvpair[1]}`;
							}
						}
						sayHello(res,greetingMsg,parsedURL);
					}); // end req.on()
			}
			break;
		default:
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("404 Not Found\n");
	}
})

const sayHello = (res,greetingMsg,parsedURL) => {
	res.writeHead(200, {'Content-Type' : 'text/html'});

	res.write('<html><head><title>sayHello</title></head>');
	res.write(`<body><H1>${greetingMsg}</H1>`);

	if (parsedURL.pathname == '/greetings/sayHelloWithTime') {
		var today = new Date();
		res.write(`<p>It is now ' + ${today.toTimeString()} </p>`);
	}
	res.end('</body></html>');
}

server.listen(process.env.PORT || 8099);