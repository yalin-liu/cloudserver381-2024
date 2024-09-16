const http = require('http');
const url = require('url');
const fs = require('fs');
const formidable = require('formidable');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongourl = "";
const dbName = "";
const collectionName = "photo";
const client = new MongoClient(mongourl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const parseForm = (req) => {
  const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0, });
  return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
      });
  });
};

const insertPhoto = async (db,r) => {
  try {
    var insertPhotoResult = await db.collection(collectionName).insertOne(r);
    console.log(insertPhotoResult);
    console.log("insert was successful!");
    console.log(JSON.stringify(insertPhotoResult));
    return insertPhotoResult.insertedId.toString();
  } catch (err) {
    console.error(err);
    return "";
  }
}

const siteRouter = async (req, res, parsedURL) => {
  if (parsedURL.pathname == '/fileupload' && req.method.toLowerCase() == "post") {
    try {
      // parse a file upload
      const { fields, files } = await parseForm(req);
      let fileProps = files.filetoupload[0];
      if (fileProps.size == 0) {
        res.writeHead(500,{"Content-Type":"text/plain"});
        res.end("No file uploaded!");  
        return;
      }

      const filename = fileProps.filepath;
      const title = (fields.title[0].length > 0) ? fields.title[0] : "untitled";
      const mimetype = fileProps.mimetype;

      const data = await fs.promises.readFile(filename);

      await client.connect();
      console.log('Connected to MongoDB server.');

      const db = client.db(dbName);
      const new_r = {};  // new document to be inserted
      new_r['title'] = title;
      new_r['mimetype'] = mimetype;
      new_r['image'] = Buffer.from(data, 'base64');
      
      var insertResult = await insertPhoto(db, new_r);
      if (insertResult) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(`<html><body>`);
        res.write(`<p>Photo was inserted into MongoDB!, Insert ID is ${insertResult}</p>`);
        res.write('<a href="/">upload again</a>');
        res.end('</body></html>');
      }
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('Title: <input type="text" name="title" minlength=1><br>');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
}

const server = http.createServer((req, res) => {
  let timestamp = new Date().toISOString();
  console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

  let parsedURL = url.parse(req.url,true); // true to get query as object
  siteRouter(req, res, parsedURL);
});

server.listen(process.env.PORT || 8099);
