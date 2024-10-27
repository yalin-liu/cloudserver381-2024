/* 
Controllers - express modules
-----------------------------
express-formiddable: https://www.npmjs.com/package/express-formidable
- express-formidable can basically parse form types, including application/x-www-form-urlencoded, application/json, and multipart/form-data.
-----------------------------
fs/promises: https://nodejs.org/zh-tw/learn/manipulating-files/reading-files-with-nodejs
-----------------------------
*/
const express = require('express');
const app = express();
const fs = require('node:fs/promises');
const formidable = require('express-formidable'); 
app.use(formidable());

/* Model - mongodb modules
mongodb ^6.9: https://www.npmjs.com/package/mongodb
*/
const { MongoClient, ObjectId } = require("mongodb");
const mongourl = '';
const client = new MongoClient(mongourl); 
const dbName = 'test';
const collectionName = "bookings";

// Views
app.set('view engine', 'ejs');

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
    res.status(200).render('list',{nBookings: docs.length, bookings: docs});
    /* list.ejs
	<html>
		<body>
		    <H2>Bookings (<%= nBookings %>)</H2>
		    <ul>
		        <% for (var b of bookings) { %>
		        <li>Booking ID: <a href="/details?_id=<%= b._id %>"><%= b.bookingid %></a></li>
		        <% } %>
		    </ul>
		</body>
	</html>
		*/
}

const handle_Details = async (res, criteria) => {
    await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    /* use Document ID for query */
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id);
	const docs = await findDocument(db, DOCID); 
	await client.close();
    console.log("Closed DB connection");
    res.status(200).render('details', {booking: docs[0]});
    /* details.ejs
	<html>
		<body>
		    <H2>Booking Details</H2><hr>
		    <p>Booking ID: <%= booking.bookingid %></p>
		    <p>Mobile: <%= booking.mobile %></p>

		    <% if (booking.photo) { %>
		        <img src="data:image/jpg;base64, <%= booking.photo %>"><br>
		    <% } %>

		    <a href="/edit?_id=<%= booking._id %>">edit</a><br>
		    <a href="/">home</a>
		</body>
	</html>
    */
}

const handle_Edit = async (res, criteria) => {
    await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
    /* use Document ID for query */
    let DOCID = {};
    DOCID['_id'] = new ObjectId(criteria._id)
	const docs = await findDocument(db, DOCID); 
	await client.close();
    console.log("Closed DB connection");
    res.status(200).render('edit',{booking: docs[0]});
    /* edit.ejs
	<html>
		<body>
		    <form action="/update" method="POST" enctype="multipart/form-data">
		        Booking ID: <input name="bookingid" value=<%= booking.bookingid %>><br>
		        Mobile: <input name="mobile" value=<%= booking.mobile %> /><br>
		        <input type="file" name="filetoupload"><br>
		        <input type="hidden" name="_id" value=<%= booking._id %>>
		        <input type="submit" value="update">  
		    </form>
		</body>
	</html>
    */
}

const handle_Update = async (req, res, criteria) => {
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(dbName);
        var DOCID = {};
        DOCID['_id'] = new ObjectId(req.fields._id);
        var updateDoc = {};
        updateDoc['bookingid'] = req.fields.bookingid;
        updateDoc['mobile'] = req.fields.mobile;
        if (req.files.filetoupload.size > 0) {
			const data = await fs.readFile(req.files.filetoupload.path, { encoding: 'base64' });
			updateDoc['photo'] = new Buffer.from(data);
            const results = await updateDocument(db, DOCID, updateDoc);
			await client.close();
    		console.log("Closed DB connection");
			res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`})
            /* info.ejs
			<html>
				<body>
					<b><%= message %></b>
					<p><a href="/">home</a></p>
				</body>
			</html>
            */
        } else {
            const results = await updateDocument(db, DOCID, updateDoc);
			await client.close();
    		console.log("Closed DB connection");
			res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`})
            /* info.ejs
			<html>
				<body>
					<b><%= message %></b>
					<p><a href="/">home</a></p>
				</body>
			</html>
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
    /* info.ejs
	<html>
		<body>
			<b><%= message %></b>
			<p><a href="/">home</a></p>
		</body>
	</html>
    */
})

app.listen(app.listen(process.env.PORT || 8099));
