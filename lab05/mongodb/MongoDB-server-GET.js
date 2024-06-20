const { MongoClient, ServerApiVersion } = require("mongodb");
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';
const collectionName = "bookings";
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const insertDocument = async (db, doc) => {
    var collection = db.collection(collectionName);
    let results = await collection.insertOne(doc);
    console.log("inserted one document " + JSON.stringify(results));
    return results;
}

const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.find(criteria).toArray();
    return results;
}

const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.deleteMany(criteria);
    return results;
}

const handle_Find = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        const docs = await findDocument(db, criteria);
        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body>');
        if (docs.length > 0) {
            res.write('<ul>');
            for (var doc of docs) {
                res.write(`<li>Booking ID: ${doc.bookingid}, Mobile: ${doc.mobile}`);
            }
            res.write('</ul>');
        } else {
            res.write('<p>No data</p>');
        }
        res.end('</body></html>');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log("Closed DB connection");
    }
}

const handle_Delete = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
    
        const results = await deleteDocument(db, criteria);
        console.log("Closed DB connection");
        console.log(results);
        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body>');
        res.write(`Deleted documents having criteria ${JSON.stringify(criteria)}: ${results.deletedCount}`);
        res.end('</body></html>');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
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