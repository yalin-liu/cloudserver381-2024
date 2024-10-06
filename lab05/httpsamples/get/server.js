const http = require('http');
const url = require('url');
const port = 8099; 
const server = http.createServer((req,res) => {
   let timestamp = new Date().toISOString();   
   console.log("Incoming request: " + req.method + " " + req.url);
   const parsedURL = url.parse(req.url,true);   
   // Access link: http://localhost:8099/login?name=peter&password=123
   switch(parsedURL.pathname) {
      case '/login':
         res.writeHead(200, {'Content-Type': 'text/html'});  
         res.write('<html><body>');  // send HTTP response body 
         res.write(`<p>${req.method} request received at ${timestamp}</p>`);
         res.write(`<p>You entered <b>${parsedURL.query.name}</b> and <b>${parsedURL.query.password}</b></p>`);
         res.end('</body></html>');  // send last piece of response and drop connection
         break;
      default:
         res.writeHead(404, {"Content-Type": "text/plain"});
         res.end("404 Not Found\n");
   }
});
server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); });
