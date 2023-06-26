const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// Q2
const fs = require('fs');
const formidable = require('formidable');
//
const assert = require('assert');
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><H2>Bookings (${docs.length})</H2><ul>`);
            for (var doc of docs) {
                //console.log(doc);
                res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
            }
            res.end('</ul></body></html>');
        });
    });
}

const handle_Details = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        findDocument(db, DOCID, (docs) => {  // docs contain 1 document (hopefully)
            client.close();
            console.log("Closed DB connection");
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body><ul>');
            //console.log(docs);
            res.write(`<H2>Booking Details</H2><hr>`)
            res.write(`<p>Booking ID: <b>${docs[0].bookingid}</b></p>`);
            res.write(`<p>Mobile: <b>${docs[0].mobile}</b></p>`)
            // Q2
            if (docs[0].photo) {
                res.write(`<img src="data:image/jpg;base64, ${docs[0].photo}"><br>`);
            }
            // Q1
            res.write(`<a href="/edit?_id=${docs[0]._id}">edit</a><br><br>`)
            //
            res.write(`<a href="/find">back<a>`);
            res.end('</body></html>');
        });
    });
}

const handle_Edit = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('bookings').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body>');
            res.write('<form action="/update" method="POST" enctype="multipart/form-data">');
            res.write(`Booking ID: <input name="bookingid" value=${docs[0].bookingid}><br>`);
            res.write(`Mobile: <input name="mobile" value=${docs[0].mobile} /><br>`);
            // Q2
            res.write('<input type="file" name="filetoupload"><br>');
            //
            res.write(`<input type="hidden" name="_id" value=${docs[0]._id}>`)
            res.write(`<input type="submit" value="update">`);
            res.end('</form></body></html>');
        });
    });
}

const updateDocument = (criteria, updateDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

         db.collection('bookings').updateOne(criteria,
            {
                $set : updateDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}

const handle_Update = (req, res, criteria) => {
    // Q2
    const form = new formidable.IncomingForm(); 
    form.parse(req, (err, fields, files) => {
        var DOCID = {};
        DOCID['_id'] = ObjectID(fields._id);
        var updateDoc = {};
        updateDoc['bookingid'] = fields.bookingid;
        updateDoc['mobile'] = fields.mobile;
        if (files.filetoupload.size > 0) {
            fs.readFile(files.filetoupload.path, (err,data) => {
                assert.equal(err,null);
                updateDoc['photo'] = new Buffer.from(data).toString('base64');
                updateDocument(DOCID, updateDoc, (results) => {
                    res.writeHead(200, {"content-type":"text/html"});
                    res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
                    res.end('<a href="/">back</a></body></html>');
                });
            });
        } else {
            updateDocument(DOCID, updateDoc, (results) => {
                res.writeHead(200, {"content-type":"text/html"});
                res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
                res.end('<a href="/">back</a></body></html>');
            });
        }
    })
    // end of Q2
}

const server = http.createServer((req,res) => {
    var parsedURL = url.parse(req.url, true);
 
    switch(parsedURL.pathname) {
        case '/':
        case '/find':
            handle_Find(res, parsedURL.query);
            break;
        case '/details':
            handle_Details(res, parsedURL.query);
            break;
        case '/edit':
            handle_Edit(res, parsedURL.query);
            break;
        case '/update':
            handle_Update(req, res, parsedURL.query);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`${parsedURL.pathname} - Unknown request!`);
    }
})
 
server.listen(process.env.PORT || 8099);