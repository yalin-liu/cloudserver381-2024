// Controllers - modules
const express = require('express');
const app = express();
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');

// Model - modules
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongourl = 'mongodb+srv://ylliustudy:ylliustudy@cluster0.ss4pkul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(mongourl); 
const dbName = 'test';
const collectionName = "bookings";

// Views
app.set('view engine', 'ejs');
app.use(formidable());

const findDocument = async (db, criteria) => {
	let findResults = [];
	let collection = db.collection(collectionName);
	console.log(`findCriteria: ${JSON.stringify(criteria)}`);
   	findResults = await collection.find(criteria).toArray();
	console.log(`findDocument: ${findResults.length}`);
	console.log(`findResults: ${JSON.stringify(findResults)}`);
	return findResults;
};

const updateDocument = async (db, criteria, updateDoc) => {
    let updateResults = [];
	let collection = db.collection(collectionName);
	console.log(`updateCriteria: ${JSON.stringify(criteria)}`);
   	updateResults = await collection.updateOne(criteria,{$set : updateDoc});
	console.log(`updateResults: ${JSON.stringify(updateResults)}`);
	return updateResults;
}

const handle_Find = async (res, criteria) => {
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    const docs = await findDocument(db, criteria);
	await client.close();
    console.log("Closed DB connection");
	// The EJS template `edit.ejs` as UI
    res.status(200).render('list',{nBookings: docs.length, bookings: docs});
    /* Write HTML codes as UI
    res.writeHead(200, {"content-type":"text/html"});
    res.write(`<html><body><H2>Bookings (${docs.length})</H2><ul>`);
    for (var doc of docs) {
        //console.log(doc);
        res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
    }
    res.end('</ul></body></html>');
    */
}

const handle_Details = async (res, criteria) => {
    await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    /* use Document ID for query */
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id);
	const docs = await findDocument(db, DOCID); // findResults contain 1 document (hopefully)
	await client.close();
    console.log("Closed DB connection");
	// The EJS template `edit.ejs` as UI
    res.status(200).render('details', {booking: docs[0]});
    /* Write HTML codes as UI
    res.writeHead(200, {"content-type":"text/html"});
    res.write('<html><body><ul>');
    //console.log(docs);
    res.write(`<H2>Booking Details</H2><hr>`)
    res.write(`<p>Booking ID: <b>${docs[0].bookingid}</b></p>`);
    res.write(`<p>Mobile: <b>${docs[0].mobile}</b></p>`)
    if (docs[0].photo) {
        res.write(`<img src="dassta:image/jpg;base64, ${docs[0].photo}"><br>`);
    }
    res.write(`<a href="/edit?_id=${docs[0]._id}">edit</a><br><br>`)s
    res.write(`<a href="/find">back<a>`);
    res.end('</body></html>');
    */
}

const handle_Edit = async (res, criteria) => {
    await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    /* use Document ID for query */
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id)
	const docs = await findDocument(db, DOCID); // findResults contain 1 document (hopefully)
	await client.close();
    console.log("Closed DB connection");
	// The EJS template `edit.ejs` as UI
    res.status(200).render('edit',{booking: docs[0]});
    /* Write HTML codes as UI
    res.writeHead(200, {"content-type":"text/html"});
    res.write('<html><body>');
    res.write('<form action="/update" method="POST" enctype="multipart/form-data">');
    res.write(`Booking ID: <input name="bookingid" value=${docs[0].bookingid}><br>`);
    res.write(`Mobile: <input name="mobile" value=${docs[0].mobile} /><br>`);
    res.write('<input type="file" name="filetoupload"><br>');
    res.write(`<input type="hidden" name="_id" value=${docs[0]._id}>`)
    res.write(`<input type="submit" value="update">`);
    res.end('</form></body></html>');
    */
}

const handle_Update = async (req, res, criteria) => {
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    // const form = new formidable.IncomingForm(); 
    // form.parse(req, (err, fields, files) => {
        var DOCID = {};
        DOCID['_id'] = new ObjectId(req.fields._id);
        var updateDoc = {};
        updateDoc['bookingid'] = req.fields.bookingid;
        updateDoc['mobile'] = req.fields.mobile;
        if (req.files.filetoupload.size > 0) {
            await fs.readFile(req.files.filetoupload.path);
			updateDoc['photo'] = new Buffer.from(data).toString('base64');
            const results = await updateDocument(db, DOCID, updateDoc);
			await client.close();
    		console.log("Closed DB connection");
			res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`})
            /*
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
            res.end('<a href="/">back</a></body></html>');
            */
        } else {
            const results = await updateDocument(db, DOCID, updateDoc);
			await client.close();
    		console.log("Closed DB connection");
			res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`})
            /*
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><p>Updated ${results.result.nModified} document(s)<p><br>`);
            res.end('<a href="/">back</a></body></html>');
            */
        }
    //})
}

app.get('/', (req,res) => {
    res.redirect('/find');
})

app.get('/find', (req,res) => {
    handle_Find(res, req.query.docs);
})

app.get('/details', (req,res) => {
    handle_Details(res, req.query);
})

app.get('/edit', (req,res) => {
    handle_Edit(res, req.query);
})

app.post('/update', (req,res) => {
    handle_Update(req, res, req.query);
})

app.get('/*', (req,res) => {
    //res.status(404).send(`${req.path} - Unknown request!`);
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

app.listen(app.listen(process.env.PORT || 8099));
