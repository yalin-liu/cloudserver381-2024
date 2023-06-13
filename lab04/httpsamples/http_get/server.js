const http = require('http');
const url = require('url');

const server = http.createServer((req,res) => {
   let timestamp = new Date().toISOString();
   
   console.log(req.url);
   
   // convert path and query string parameters of incoming requests to JSON
   const parsedURL = url.parse(req.url,true);
   
   switch(parsedURL.pathname) {
      case '/login':
         res.writeHead(200, {'Content-Type': 'text/html'});  // send HTTP response header
         res.write('<html><body>');  // send HTTP response body 
         res.write(`<p>${req.method} request received at ${timestamp}</p>`);
         res.write(`<p>You entered <b>${parsedURL.query.name}</b> and <b>${parsedURL.query.password}</b></p>`);
         res.end('</body></html>');  // send last piece of response and drop connection
         break;
      /*
      case '/favicon.ico':
         console.log('favicon requested');
         res.end();
         break;
      */
      default:
         res.writeHead(404, {"Content-Type": "text/plain"});
         res.end("404 Not Found\n");
   }
});
server.listen(process.env.PORT || 8099);
