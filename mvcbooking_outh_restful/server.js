var express             = require('express'),
    app                 = express(),
    passport            = require('passport'),
    FacebookStrategy    = require('passport-facebook').Strategy,
	{ MongoClient, ServerApiVersion, ObjectId } = require("mongodb"),
    session             = require('express-session'),
	formidable 			= require('express-formidable'),
	fsPromises 			= require('fs').promises;

app.set('view engine', 'ejs');

// FacebookAuth strategy
const facebookAuth = {
      'clientID'        : '218475671269651', 
      'clientSecret'    : '507d891eef48b86fc3bee8e1a1bc8f5f', 
      'callbackURL'     : 'http://localhost:8099/auth/facebook/callback'
};

// MongoDB database info
const mongourl = 'mongodb+srv://ylliustudy:ylliustudy@cluster0.ss4pkul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'test';
const collectionName = "bookings";

// user object to be put in session (for login/logout)
var user = {};  
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (id, done) {
    done(null, user);
});

// passport facebook strategy
passport.use(new FacebookStrategy({
    "clientID"        : facebookAuth.clientID,
    "clientSecret"    : facebookAuth.clientSecret,
    "callbackURL"     : facebookAuth.callbackURL
  },  
  function (token, refreshToken, profile, done) {
    console.log("Facebook Profile: " + JSON.stringify(profile));
    console.log(profile);
    user = {};
    user['id'] = profile.id;
    user['name'] = profile.displayName;
    user['type'] = profile.provider;  
    console.log('user object: ' + JSON.stringify(user));
    return done(null,user);  
  })
);

// Mongodb handling functions
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
	console.log("insert one document:" + JSON.stringify(results));
    return results;
}

const findDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.find(criteria).toArray();
	console.log("find the documents:" + JSON.stringify(results));
    return results;
}

const updateDocument = async (db, criteria, updateData) => {
    var collection = db.collection(collectionName);
    let results = await collection.updateOne(criteria, { $set: updateData });
	console.log("update one document:" + JSON.stringify(results));
    return results;
}

const deleteDocument = async (db, criteria) => {
    var collection = db.collection(collectionName);
    let results = await collection.deleteMany(criteria);
	console.log("delete one document:" + JSON.stringify(results));
    return results;
}

const handle_Create = async (req, res) => {
	//try {
		await client.connect();
		console.log("Connected successfully to server");
        const db = client.db(dbName);
        let newDoc = {
            userid: req.user.id,
            bookingid: req.fields.bookingid,
            mobile: req.fields.mobile
        };

        if (req.files.filetoupload && req.files.filetoupload.size > 0) {
            const data = await fsPromises.readFile(req.files.filetoupload.path);
            newDoc.photo = Buffer.from(data).toString('base64');
        }

		await insertDocument(db, newDoc);
        res.redirect('/');
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

const handle_Find = async (req, res, criteria) => {
	//try {
		await client.connect();
        console.log("Connected successfully to server");
		const db = client.db(dbName);
		const docs = await findDocument(db);
        res.status(200).render('list',{nBookings: docs.length, bookings: docs, user: req.user});
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

const handle_Details = async (req, res, criteria) => {
	//try {
		await client.connect();
		console.log("Connected successfully to server");
        const db = client.db(dbName);
        let DOCID = { _id: ObjectId.createFromHexString(criteria._id) };
        const docs = await findDocument(db, DOCID);
        res.status(200).render('details', { booking: docs[0], user: req.user});
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

const handle_Edit = async (req, res, criteria) => {
	//try {
		await client.connect();
		console.log("Connected successfully to server");
        const db = client.db(dbName);

        let DOCID = { '_id': ObjectId.createFromHexString(criteria._id) };
        let docs = await findDocument(db, DOCID);

        if (docs.length > 0 && docs[0].userid == req.user.id) {
            res.status(200).render('edit', { booking: docs[0], user: req.user});
        } else {
            res.status(500).render('info', { message: 'Unable to edit - you are not booking owner!', user: req.user});
        }
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

const handle_Update = async (req, res, criteria) => {
	//try {
		await client.connect();
		console.log("Connected successfully to server");
        const db = client.db(dbName);

        const DOCID = {
            _id: ObjectId.createFromHexString(req.fields._id)
        }

        let updateData = {
            bookingid: req.fields.bookingid,
            mobile: req.fields.mobile,
        };

        if (req.files.filetoupload && req.files.filetoupload.size > 0) {
            const data = await fsPromises.readFile(req.files.filetoupload.path);
            updateData.photo = Buffer.from(data).toString('base64');
        }

        const results = await updateDocument(db, DOCID, updateData);
        res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`, user: req.user});
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

const handle_Delete = async (req, res) => {
	//try {
		await client.connect();
		console.log("Connected successfully to server");
        const db = client.db(dbName);
        let DOCID = { '_id': ObjectId.createFromHexString(req.query._id) };
        let docs = await findDocument(db, DOCID);
        if (docs.length > 0 && docs[0].userid == req.user.id) {   // user object by Passport.js
            //await db.collection('bookings').deleteOne(DOCID);
			await deleteDocument(db, DOCID);
            res.status(200).render('info', { message: `Booking ID ${docs[0].bookingid} removed.`, user: req.user});
        } else {
            res.status(500).render('info', { message: 'Unable to delete - you are not booking owner!', user: req.user});
        }
	//} catch(err) {
	//	console.error(err);
	//} finally {
	//	await client.close();
    //    console.log("Closed DB connection");
	//}
}

// Middleware 1, use formidable()
app.use(formidable());

// Middleware 1, define and use it
app.use((req,res,next) => {
    let d = new Date();
    console.log(`TRACE: ${req.path} was requested at ${d.toLocaleDateString()}`);  
    next();
});

// Middleware 2, define
const isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

// Middleware 3,4,5, use
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// login page
app.get("/login", function (req, res) {
    //res.send("<a href='/auth/facebook'>login through facebook</a>");
	res.status(200).render('login');
});
app.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/list",
        failureRedirect : "/"
}));

app.get('/', isLoggedIn, (req,res) => {
    res.redirect('/list');
})

app.get('/list', isLoggedIn, (req,res) => {
    handle_Find(req, res, req.query.docs);
})

app.get('/details',isLoggedIn, (req,res) => {
    handle_Details(req, res, req.query);
})

app.get('/edit', isLoggedIn, (req,res) => {
    handle_Edit(req, res, req.query);
})

app.post('/update', isLoggedIn, (req,res) => {
    handle_Update(req, res, req.query);
})

app.get('/create', isLoggedIn, (req,res) => {
    res.status(200).render('create',{user:req.user})
})
app.post('/create', isLoggedIn, (req, res) => {
    handle_Create(req, res);
});

app.get('/delete', isLoggedIn, (req,res) => {
    handle_Delete(req, res);
});

app.get("/logout", function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

//
// RESTful
//

/*  CREATE
curl -X POST -H "Content-Type: application/json" --data '{"bookingid":"BK999","mobile":"00000000"}' localhost:8099/api/booking/BK999

curl -X POST -F 'bookingid=BK999' -F "filetoupload=@image.png" localhost:8099/api/booking/BK999

curl -X POST -F 'bookingid=BK999' -F "bookingid=BK999" -F "mobile=00000000" -F "filetoupload=@image.png" localhost:8099/api/booking/BK999
*/
app.post('/api/booking/:bookingid', async (req,res) => { //async programming way
    if (req.params.bookingid) {
        console.log(req.body)
		//try {
			await client.connect();
			console.log("Connected successfully to server");
		    const db = client.db(dbName);
		    let newDoc = {
		        //userid: req.user.id,
		        bookingid: req.fields.bookingid,
		        mobile: req.fields.mobile};
		    if (req.files.filetoupload && req.files.filetoupload.size > 0) {
		        const data = await fsPromises.readFile(req.files.filetoupload.path);
		        newDoc.photo = Buffer.from(data).toString('base64');}
			await insertDocument(db, newDoc);
		    res.status(200).json({"Successfully inserted":newDoc}).end();
		//} catch(err) {
		//	console.error(err);
		//} finally {
		//	await client.close();
		//    console.log("Closed DB connection");
		//}
    } else {
        res.status(500).json({"error": "missing bookingid"});
    }
})

/* READ
curl -X GET http://localhost:8099/api/booking/BK001
*/

app.get('/api/booking/:bookingid', async (req,res) => { //async programming way
	if (req.params.bookingid) {
		console.log(req.body)
        let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
		/*const criteria = { bookingid: req.params.bookingid }*/ //another coding way	
		//try {
			await client.connect();
		    console.log("Connected successfully to server");
			const db = client.db(dbName);
			const docs = await findDocument(db, criteria);
		    res.status(200).json(docs);
		//} catch(err) {
		//	console.error(err);
		//} finally {
		//	await client.close();
		//    console.log("Closed DB connection");
		//}
	} else {
        res.status(500).json({"error": "missing bookingid"}).end();
    }
});

/*  UPDATE
curl -X PUT -H "Content-Type: application/json" --data '{"mobile":"88888888"}' localhost:8099/api/booking/BK999

curl -X PUT -F "mobile=99999999" localhost:8099/api/booking/BK999 
*/
app.put('/api/booking/:bookingid', async (req,res) => {
    if (req.params.bookingid) {
        console.log(req.body)
		let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
		//try {
			await client.connect();
			console.log("Connected successfully to server");
		    const db = client.db(dbName);

		    // const DOCID = {
		    //     _id: ObjectId.createFromHexString(req.fields._id)
		    // }

		    let updateData = {
		        bookingid: req.fields.bookingid || req.params.bookingid,
		        mobile: req.fields.mobile,
		    };

		    if (req.files.filetoupload && req.files.filetoupload.size > 0) {
		        const data = await fsPromises.readFile(req.files.filetoupload.path);
		        updateData.photo = Buffer.from(data).toString('base64');
		    }

		    const results = await updateDocument(db, criteria, updateData);
		    res.status(200).json(results).end();
		//} catch(err) {
		//	console.error(err);
		//} finally {
		//	await client.close();
		//    console.log("Closed DB connection");
		//}
    } else {
        res.status(500).json({"error": "missing bookingid"});
    }
})

/*  DELETE
curl -X DELETE localhost:8099/api/booking/BK999
*/
app.delete('/api/booking/:bookingid', async (req,res) => {
    if (req.params.bookingid) {
		console.log(req.body)
		let criteria = {};
        criteria['bookingid'] = req.params.bookingid;
		//try {
			await client.connect();
			console.log("Connected successfully to server");
		    const db = client.db(dbName);
		    // let DOCID = { '_id': ObjectId.createFromHexString(req.query._id) };
		    // let docs = await findDocument(db, DOCID);
		    const results = await deleteDocument(db, criteria);
            console.log(results)
		    res.status(200).json(results).end();
		//} catch(err) {
		//	console.error(err);
		//} finally {
		//	await client.close();
		//    console.log("Closed DB connection");
		//}
    } else {
        res.status(500).json({"error": "missing bookingid"});       
    }
})
//
// End of Restful
//

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

const port = process.env.PORT || 8099;
app.listen(port, () => {console.log(`Listening at http://localhost:${port}`);});
