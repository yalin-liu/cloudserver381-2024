const http = require('http');const port = 8099; 
const qs = require ('querystring');const fs = require('fs');
const server = http.createServer((req,res) => {
   let timestamp = new Date().toISOString();
   console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);   
   if (req.method == 'POST') {
      let data = '';  // message body data
      // process data in message body
      req.on('data', (payload) => {
         data += payload;});
      // when no more data in message body
      req.on('end', () => {  
         let postdata = qs.parse(data);
         res.writeHead(200, {'Content-Type': 'text/html'}); 
         res.write('<html>')        
         res.write(`Name = ${postdata.name}`);
         res.write('<br>')
         res.write(`Password = ${postdata.password}`);
         res.end('</html>')})
   } else {
	     fs.readFile('form.html', function (err, html) {if (err) {throw err; }
		 res.writeHead(200, {"Content-Type": "text/html"});  
         res.write(html);  
         res.end(); })
      //res.writeHead(404, {'Content-Type': 'text/plain'}); 
      //res.end('I can only handle POST request!!! Sorry.')
   }
});
server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); });
