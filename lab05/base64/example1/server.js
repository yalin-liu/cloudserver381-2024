const http = require('http');
const url = require('url');
const fs = require('fs');
const formidable = require('formidable');

const parseForm = (req) => {
  const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0, });
  return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
      });
  });
};

const siteRouter = async (req, res, parsedURL) => {  
  if (parsedURL.pathname == '/fileupload' && req.method.toLowerCase() == "post") {
    // parse a file upload
    const { fields, files } = await parseForm(req);
    let fileProps = files.filetoupload[0];
    console.log(`filename:  ${fileProps.originalFilename}`);
    console.log(`type: ${fileProps.mimetype}`);
    if (fileProps && fileProps.size > 0) {
      const data = await fs.promises.readFile(fileProps.filepath);
      const base64 = new Buffer.from(data).toString('base64');
      res.writeHead(200,{"Content-Type": "text/plain"});
      res.write('File uploaded: (Base64)\n');
      res.end(base64);
    } else {
      res.writeHead(200, {"content-type":"text/html"});
      res.write('<html><body><p>No file uploaded!</p>');
      res.write('<a href="/">Try upload again</a>');
      res.end('</body></html>');
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
}

const server = http.createServer((req, res) => {
  let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
  var parsedURL = url.parse(req.url, true);  // true to get query as object 
  siteRouter(req, res, parsedURL);
});

server.listen(process.env.PORT || 8099);