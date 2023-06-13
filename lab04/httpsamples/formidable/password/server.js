const http = require('http');
const url = require('url');
const formidable = require('formidable');

const server = http.createServer((req,res) => {
    let timestamp = new Date().toISOString();
    console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
    
    var parsedURL = url.parse(req.url,true);

    switch(parsedURL.pathname) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.write('<html><body>');
            res.write('<form action="http://localhost:8099/login" method="POST">');
            res.write('User Name: <input type="text" name="name"><br></input>');
            res.write('Password: <input type="password" name="password"><br>');
            res.write('<input type="submit" value="Login">');
            res.end('</form></body></html>');
            break;
        case '/login':
            var form = new formidable.IncomingForm();
            form.parse(req,(err,fields,files) => {
                res.writeHead(200, {'Content-Type': 'text/html'}); 
                res.write('<html>');       
                res.write(`<p>User Name = ${fields.name}</p>`);
                res.write(`<p>Password = ${fields.password}</p>`);
                res.end('</html>');  
            });
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'}); 
            res.end(`${parsedURL.pathname} - Unknown Request!`);
    }
});
server.listen(process.env.PORT || 8099);
