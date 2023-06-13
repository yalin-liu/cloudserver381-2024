const http = require('http');
const url = require('url');
const formidable = require('formidable');
const sharp = require('sharp');
const assert = require('assert');

const server = http.createServer((req,res) => {
    let timestamp = new Date().toISOString();
    console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
    
    var parsedURL = url.parse(req.url,true);

    switch(parsedURL.pathname) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.write('<html><body>');
            res.write('<form action="http://localhost:8099/resize" enctype="multipart/form-data" method="POST">');
            res.write('Image file: <input type="file" name="filetoupload"><br><br>');
            res.write('Rotate (clockwise, 0 - 360 degree): <input type="number" name="rotate" value=0 max=360><br>');
            res.write('New width (no. of pixels): <input type="number" name="width" value=0><br>');
            res.write('New height (no. of pixels): <input type="number" name="height" value=0><br><br>');
            res.write('<input type="submit" value="Resize">');
            res.end('</form></body></html>');
            break;
        case '/resize':
            var form = new formidable.IncomingForm();
            form.parse(req,(err,fields,files) => {
                console.log(`File type: ${files.filetoupload.type}`);
                let rotate = parseInt(fields.rotate);
                let resize = {};
                if (parseInt(fields.width) > 0) {
                    resize['width'] = parseInt(fields.width);
                }
                if (parseInt(fields.height) > 0) {
                    resize['height'] = parseInt(fields.height);
                }
                sharp(files.filetoupload.path).rotate(rotate).resize(resize).toBuffer((err, data) => {
                    assert.equal(err,null);
                    res.writeHead(200, {'Content-Type': '`${files.filetoupload.type}`'}); 
                    res.end(data);
                })
            });
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'}); 
            res.end(`${parsedURL.pathname} - Unknown Request!`);
    }
});
server.listen(process.env.PORT || 8099);
