const fs = require('fs');
const formidable = require('formidable');
const http = require('http');
const url = require('url');
const assert = require('assert');

var doc = {};  // document contains a title, photo (base64) and the photo's mimetype

const server = http.createServer((req,res) => {
    var parsedURL = url.parse(req.url, true);
 
    switch(parsedURL.pathname) {
        case '/':
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body><title>Upload Photo</title>');
            res.write('<form action="/upload" method="POST" enctype="multipart/form-data">');
            res.write('Title: <input type="text" name="title"><br>');
            res.write('<input type="file" name="filetoupload"><br>');
            res.write(`<input type="submit" value="upload">`);
            res.end('</form></body></html>');
            break;
        case '/upload':
            const form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (files.filetoupload && files.filetoupload.size > 0) {
                    fs.readFile(files.filetoupload.path, (err,data) => {
                        assert.equal(err,null);
                        doc['title'] = fields.title;
                        doc['photo'] = new Buffer.from(data).toString('base64');
                        doc['mimetype'] = files.filetoupload.type;
                        res.writeHead(200, {"content-type":"text/html"});
                        res.end('<html><body><a href="/view">view uploaded photo</a></body></html>');
                    })
                } else {
                    res.writeHead(200, {"content-type":"text/html"});
                    res.write('<html><body><p>No file uploaded!</p>');
                    res.write('<a href="/">Try upload again</a>');
                    res.end('</body></html>');
                }
            });
            break;
        case '/view':
            if (doc.photo && doc.mimetype) {
                res.writeHead(200, {"content-type":"text/html"});
                res.write('<html><body>');
                if (doc.title) res.write(`<H3>${doc.title}</H3>`)
                res.write(`<img src="data:${doc.mimetype};base64, ${doc.photo}"><br>`);
                res.end('</body></html>')    
            }
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`${parsedURL.pathname} - Unknown request!`);
    }
})
 
server.listen(process.env.PORT || 8099);