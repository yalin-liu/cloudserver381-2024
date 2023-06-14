const http = require('http');
const url = require('url');
const fs = require('fs');
const formidable = require('formidable');

const server = http.createServer((req, res) => {
  let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	let parsedURL = url.parse(req.url,true); // true to get query as object 
  
  if (parsedURL.pathname == '/fileupload' && 
      req.method.toLowerCase() == "post") {
    // parse a file upload
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(`filename =  ${files.filetoupload.path}`);
      console.log(`type: ${files.filetoupload.type}`);
      fs.readFile(files.filetoupload.path, (err,data) => {
         const base64 = new Buffer(data).toString('base64');
         res.writeHead(200,{"Content-Type": "text/plain"});
         res.write('File uploaded: (Base64)\n');         
         res.end(base64);
      })
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
});

server.listen(process.env.PORT || 8099);