const http = require('http');  
const url = require('url');
const port = 8099; 
function Rectangle(width,length) {  
	this.width = width;  
	this.length = length;
	this.area = this.width * this.length;}

function handle_incoming_request(req, res) {
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	var parsedURL = url.parse(req.url,true); 
	var queryAsObject = parsedURL.query;
	var obj = new Rectangle(queryAsObject.width, queryAsObject.length);  
	res.writeHead(200, {"Content-Type" : "application/json"});  
	res.end(JSON.stringify(obj));;
	}

const server = http.createServer(handle_incoming_request); 

server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); });
