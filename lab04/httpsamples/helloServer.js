// helloServer.js
const http = require('http');
const helloServer = http.createServer(function(req,res) {
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write('<html><head>');
	res.write('<title>Hello World Page</title>');
	res.write('<head>');
	res.write('<body><h1>Hello World!</h1><body>');
	res.end('</html>');
});

helloServer.listen(8099);
