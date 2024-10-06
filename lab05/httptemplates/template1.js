// Importing 'http' module 
const http = require('http'); 

// Setting Port Number as 8099
const port = 8099; 

// Creating Server to Handle Request and Response 
const server = http.createServer((req,res)=>{
	console.log(req.method + req.url);
	res.statusCode=200; 
	res.setHeader('Content-Type', 'text/plain') 
	res.end("Hello World!!!!") 
}); 

// Making the server to listen to required hostname and port number 
server.listen(process.env.PORT || 8099,()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); 
}); 
