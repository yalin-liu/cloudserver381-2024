const http = require('http'); 
const url = require('url');

const handle_incoming_request = (req,res) => {
   let timestamp = new Date().toISOString();
   console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

   let parsedURL = url.parse(req.url,true); // true to get query as object 

   res.writeHead(200,{"Content-Type" : "text/html"});
   res.write("<html><body>");
   res.write(`Request method: ${req.method} <br>`);
   res.write(`Request path: ${parsedURL.pathname}<br>`);
   res.write(`Query String: ${url.parse(req.url).query}<br><br>`);
 
   console.log(`Pathname: ${parsedURL.pathname}`)
   console.log(`Query string parameter(s): ${JSON.stringify(parsedURL.query)}`);
   
   let number_of_query_string_parameters = Object.keys(parsedURL.query).length;
   if (number_of_query_string_parameters > 0) {
      res.write(`No. of query string parameter(s): ${number_of_query_string_parameters}<br>`);
      for (key in parsedURL.query) {
         res.write(`${key} = ${parsedURL.query[key]}<br>`);
      }
   } else {
      res.write('There is no query string parameter!<br>')
   }

   res.write(`<br>User Agent: ${req.headers['user-agent']}`);
   res.end("</body></html>");   
}

const server = http.createServer(handle_incoming_request);
server.listen(process.env.PORT ||  8099);