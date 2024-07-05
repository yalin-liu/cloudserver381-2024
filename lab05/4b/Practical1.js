const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const findDocument = async (db, criteria, callback) => {
    let collection = db.collection('bookings');
    let docs = await collection.find(criteria).toArray();
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    console.log(`findDocument: ${docs.length}`);
    return docs;
}

const handle_Find = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const docs = await findDocument(db, criteria);

        res.writeHead(200, {"content-type":"text/html"});
        res.write(`<html><body><H2>Bookings (${docs.length})</H2><ul>`);
        for (var doc of docs) {
            res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
        }
        res.end('</ul></body></html>');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        console.log("Closed DB connection");
    }
}

const handle_Details = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectId.createFromHexString(criteria._id)
        const docs = await findDocument(db, DOCID);

        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body><ul>');
        console.log(docs);
        res.write(`<H2>Booking Details</H2><hr>`)
        res.write(`<p>Booking ID: <b>${docs[0].bookingid}</b></p>`);
        res.write(`<p>Mobile: <b>${docs[0].mobile}</b></p>`)
        // Q1
        res.write(`<a href="/edit?_id=${docs[0]._id}">edit</a><br><br>`)
        // 
        res.write(`<a href="/find">back<a>`);
        res.end('</body></html>');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        console.log("Closed DB connection");
    }
}

const handle_Edit = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectId.createFromHexString(criteria._id)
        const docs = await db.collection('bookings').find(DOCID).toArray();

        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body>');
        res.write('<form action="/update" method=GET>');
        res.write(`Booking ID: <input name="bookingid" value=${docs[0].bookingid}><br>`);
        res.write(`Mobile: <input name="mobile" value=${docs[0].mobile} /><br>`);
        res.write(`<input type="hidden" name="_id" value=${docs[0]._id}>`)
        res.write(`<input type="submit" value="update">`);
        res.end('</form></body></html>');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        console.log("Closed DB connection");
    }
}

const handle_Update = async (res, criteria) => {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectId.createFromHexString(criteria._id);

        const updateContent = {
            $set : {
                "bookingid": criteria.bookingid,
                "mobile": criteria.mobile
            }
        };
        const results = await db.collection('bookings').updateOne(DOCID, updateContent);

        res.writeHead(200, {"content-type":"text/html"});
        res.write(`<html><body><p>Updated ${results.modifiedCount} document(s)<p><br>`);
        res.end('<a href="/">back</a></body></html>');
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        console.log("Closed DB connection");
    }
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
