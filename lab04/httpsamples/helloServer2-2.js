// Do more than returning a hello world html page
// This version determines what to return by looking at the pathname in the GET requests.
//
// GET /    : Return the default 'hello world' html page
// GET /date: Return a html page with the current server date
// GET /time: Return a html page with the current server time

const http = require('http');
const url = require('url');

const helloServer = http.createServer((req,res) => {

	let timestamp = new Date().toISOString();
    console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	var parsedURL = url.parse(req.url,true); // true to get query as object 

	let title = '';
	let body = '';

	console.log(`Incoming request pathname=${parsedURL.pathname}`);
	switch (parsedURL.pathname) {
		case '/date':
			title = 'Server Date';
			body = new Date().toDateString();
			break;
		case '/time':
			title = 'Server Time';
			body = new Date().toTimeString();
			break;
		default:
			title = 'Hello World Page';
			body = 'Hello World!';
	}

	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write('<html><head>');
	res.write(`<title>${title}</title>`);
	res.write('<head>');
	res.write(`<body><h1>${body}</h1><body>`);
	res.end('</html>');
});

helloServer.listen(8099);
