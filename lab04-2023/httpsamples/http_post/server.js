const http = require('http');
const qs = require ('querystring');

const formServer = http.createServer((req,res) => {
   let timestamp = new Date().toISOString();
   console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
   
   if (req.method == 'POST') {
      let data = '';  // message body data

      // process data in message body
      req.on('data', (payload) => {
         data += payload;
      });

      // when no more data in message body
      req.on('end', () => {  
         let postdata = qs.parse(data);
         res.writeHead(200, {'Content-Type': 'text/html'}); 
         res.write('<html>')        
         res.write(`User Name = ${postdata.name}`);
         res.write('<br>')
         res.write(`Password = ${postdata.password}`);
         res.end('</html>')                 
      })
   } else {
      res.writeHead(404, {'Content-Type': 'text/plain'}); 
      res.end('I can only handle POST request!!! Sorry.')
   }
});
formServer.listen(process.env.PORT || 8099);
