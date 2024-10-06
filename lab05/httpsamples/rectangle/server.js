const http = require('http'); 
const url = require('url');
const port = 8099; 

class Rectangle {
   constructor (width = 1, length = 1) { 
      this.width = width;
      this.length = length;
      this.area = this.width * this.length;
   }

   toString() {
      return(`Area of rectangle having length <b>${this.length}</b>, width <b>${this.width}</b> = <b>${this.area}</b>`)
   }
}

const server = http.createServer((req, res) => {
   console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);
   
   let parsedURL = url.parse(req.url,true);  //true to get query as object

   switch(parsedURL.pathname) {
      case '/':
         res.writeHead(200, {"Content-Type" : "text/html"});
         res.write("<html>");
         res.write("<title>Rectangle Area Calculator</title>");
         res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
         res.write('<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">');
         res.write('<body>');
         res.write('<div class="w3-container">');
         res.write("<form action='/area'>");
         res.write("Length: <input type='number' name='length' min=1 value=1>");
         res.write("<br>");
         res.write("Width: <input type='number' name='width' min=1 value=1>");     
         res.write("<br>"); 
         res.write("<input type='submit' value='Calcuate Area'>");       
         res.write("</form>");
         res.write('</div>');
         res.write('</body>')
         res.end("</html>");    
         break;
      case '/area':
      case '/api/area':
         let obj = new Rectangle(parsedURL.query.width, parsedURL.query.length); 
         if (parsedURL.pathname == '/area') {
            res.writeHead(200, {"Content-Type" : "text/html"});
            res.write("<html>");
            res.write("<title>Rectangle Area Calculator</title>");
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
            res.write('<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">');
            res.write('<body>');
            res.write('<div class="w3-container">');         
            res.write(`<p>${obj.toString()}</p>`);
            res.write("<br><a href='/'>Back</a>");
            res.write('</div>');         
            res.write('</body>')         
            res.end("</html>");
         } else {
            res.writeHead(200, {"Content-Type" : "application/json"}); 
            res.end(JSON.stringify(obj));;
         }
         break;
      default:
         res.writeHead(404, {"Content-Type" : "text/html"});
         res.write("<html><body>");
         res.write(`<h1>Unknown request: ${parsedURL.pathname}!</h1>`)
         res.end("</body></html>");    
   }
});

server.listen(process.env.PORT || port, ()=>{// Callback 
    console.log(`Server running at http://localhost:${port}/`); });
