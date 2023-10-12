const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;//Alin: "mongodb": "3.6.5" works
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
            res.write('<form action="/update" method=GET>');
            res.write(`Booking ID: <input name="bookingid" value=${docs[0].bookingid}><br>`);
            res.write(`Mobile: <input name="mobile" value=${docs[0].mobile} /><br>`);
            res.write(`<input type="hidden" name="_id" value=${docs[0]._id}>`)
            res.write(`<input type="submit" value="update">`);
            res.end('</form></body></html>');
        });
    });
}

const handle_Update = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        db.collection('bookings').updateOne(DOCID,
            {
                $set : {
                    "bookingid": criteria.bookingid,
                    "mobile": criteria.mobile
                }
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                //console.log(results.result.nModified);
                res.writeHead(200, {"content-type":"text/html"});
                res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
                res.end('<a href="/">back</a></body></html>');
            }
        );
    });
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
            handle_Update(res, parsedURL.query);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`${parsedURL.pathname} - Unknown request!`);
    }
})
 
server.listen(process.env.PORT || 8099);
