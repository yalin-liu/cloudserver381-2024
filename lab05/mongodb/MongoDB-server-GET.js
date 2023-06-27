const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';
 
const insertDocument = (db, doc, res, callback) => {
    db.collection('bookings').
    insertOne(doc, (err, result) => {
        assert.equal(err,null);
        console.log("inserted one document " + JSON.stringify(doc));
        callback(result,res);
    });
}

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        callback(docs);
    });
}

const deleteDocument = (db, criteria, callback) => {
    db.collection('bookings').deleteMany(criteria, (err,results) => {
        assert.equal(err,null);
        console.log('deleteMany was successful');
        callback(results);
    })
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
            res.write('<html><body><ul>');
            for (var doc of docs) {
                //console.log(doc);
                res.write(`<li>Booking ID: ${doc.bookingid}, Mobile: ${doc.mobile}`);
            }
            res.end('</ul></body></html>');
        });
    });
}

const handle_Delete = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
    
        deleteDocument(db, criteria, (results) => {
            client.close();
            console.log("Closed DB connection");
            console.log(results);
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body>');
            res.write(`Deleted documents having criteria ${JSON.stringify(criteria)}: ${results.deletedCount}`);
            res.end('</body></html>');
        });
    });
}

const server = http.createServer((req,res) => {
    var parsedURL = url.parse(req.url, true);
 
    switch(parsedURL.pathname) {
        case '/find':
            handle_Find(res, parsedURL.query);
            break;
        case '/delete':
            handle_Delete(res, parsedURL.query);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`${parsedURL.pathname} - Unknown request!`);
    }
})
 
server.listen(process.env.PORT || 8099);