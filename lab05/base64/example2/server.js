const http = require('http');
const url = require('url');
const fs = require('fs');
const formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongourl = "";
const dbName = "";

const server = http.createServer((req, res) => {
  let timestamp = new Date().toISOString();
  console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

  let parsedURL = url.parse(req.url,true); // true to get query as object

  if (parsedURL.pathname == '/fileupload' && 
      req.method.toLowerCase() == "post") {
    // parse a file upload
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (files.filetoupload.size == 0) {
        res.writeHead(500,{"Content-Type":"text/plain"});
        res.end("No file uploaded!");  
      }
      const filename = files.filetoupload.path;
      const title = (fields.title.length > 0) ? fields.title : "untitled";
      const mimetype = files.filetoupload.type;
      fs.readFile(filename, (err,data) => {
        const client = new MongoClient(mongourl);
        client.connect((err) => {
          try {
            assert.equal(err,null);
          } catch (err) {
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.end("MongoClient connect() failed!");
            return(-1);
          }
          console.log('Connected to MongoDB server.')
          const db = client.db(dbName);
          const new_r = {};  // new document to be inserted
          new_r['title'] = title;
          new_r['mimetype'] = mimetype;
          new_r['image'] = new Buffer(data).toString('base64');
          insertPhoto(db,new_r,(result) => {
            client.close();
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end('Photo was inserted into MongoDB!');
          })
        });
      })
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('Title: <input type="text" name="title" minlength=1><br>');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
});

const insertPhoto = (db,r,callback) => {
  db.collection('photo').insertOne(r,function(err,result) {
    assert.equal(err,null);
    console.log("insert was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
}

server.listen(process.env.PORT || 8099);
