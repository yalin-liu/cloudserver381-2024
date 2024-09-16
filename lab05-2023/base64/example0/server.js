const fs = require('fs');
const formidable = require('formidable');
const http = require('http');
const url = require('url');

var doc = {};  // document contains a title, photo (base64) and the photo's mimetype

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
            try {
                const { fields, files } = await parseForm(req);
                let fileProps = files.filetoupload[0];
                if (fileProps && fileProps.size > 0) {
                    const data = await fs.promises.readFile(fileProps.filepath);
                    doc['title'] = fields.title[0];
                    doc['photo'] = new Buffer.from(data).toString('base64');
                    doc['mimetype'] = fileProps.mimetype;
                    res.writeHead(200, {"content-type":"text/html"});
                    res.end('<html><body><a href="/view">view uploaded photo</a></body></html>');
                } else {
                    res.writeHead(200, {"content-type":"text/html"});
                    res.write('<html><body><p>No file uploaded!</p>');
                    res.write('<a href="/">Try upload again</a>');
                    res.end('</body></html>');
                }
            } catch (err) {
                console.error(err);
            }
            
            break;
        case '/view':
            if (doc.photo && doc.mimetype) {
                res.writeHead(200, {"content-type":"text/html"});
                res.write('<html><body>');
                if (doc.title) res.write(`<H3>${doc.title}</H3>`)
                res.write(`<img src="data:${doc.mimetype};base64, ${doc.photo}" width="300"><br>`);
                res.write('<a href="/">Upload again</a>');
                res.end('</body></html>');
            } else {
                res.write('<html><body>');
                res.write('<p>The global variable "doc" is empty</p>');
                res.write('<a href="/">Back to upload</a>');
                res.end('</body></html>');
            }
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`${parsedURL.pathname} - Unknown request!`);
    }
}

const server = http.createServer((req,res) => {
    var parsedURL = url.parse(req.url, true);
    siteRouter(req, res, parsedURL);
});
 
server.listen(process.env.PORT || 8099);