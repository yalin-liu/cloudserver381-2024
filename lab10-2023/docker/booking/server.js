const express = require('express');
const app = express();
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const fsPromises = require('fs').promises;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const mongourl = 'mongodb://root:password@mongo:27017/test?authMechanism=DEFAULT&authSource=admin'
const dbName = 'test';

app.use(formidable());
app.set('view engine', 'ejs');

// Middleware
app.use((req,res,next) => {
    let d = new Date();
    console.log(`TRACE: ${req.path} was requested at ${d.toLocaleDateString()}`);  
    next();
});

// Connect mongodb
const client = new MongoClient(mongourl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Passport.js
const passport            = require('passport');
const FacebookStrategy    = require('passport-facebook').Strategy;
const session             = require('express-session');

const facebookAuth = {
      'clientID'        : '218475671269651', // facebook App ID
      'clientSecret'    : '507d891eef48b86fc3bee8e1a1bc8f5f', // facebook App Secret
      'callbackURL'     : 'http://localhost:8099/auth/facebook/callback'
};

var user = {};  // user object to be put in session

// passport needs ability to serialize and unserialize users out of session
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
    //console.log("Facebook Profile: " + JSON.stringify(profile));
    console.log("Facebook Profile: ");
    console.log(profile);
    user = {};
    user['id'] = profile.id;
    //user['name'] = profile.name.givenName;
    user['name'] = profile.displayName;
    user['type'] = profile.provider;  // Facebook? Google? Twitter?
    console.log('user object: ' + JSON.stringify(user));
    return done(null,user);  // put user object into session => req.user
  })
);

const isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const findDocument = async (db, criteria) => {
    var collection = db.collection('bookings');
    let results = await collection.find(criteria).toArray();
    return results;
}

const handle_Find = async (req, res, criteria) => {
	try {
		await client.connect();
        console.log("Connected successfully to server");
		const db = client.db(dbName);
		const docs = await findDocument(db);
        res.status(200).render('list',{nBookings: docs.length, bookings: docs, username: req.user.name});
	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
        console.log("Closed DB connection");
	}
}

const handle_Details = async (req, res, criteria) => {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
        const db = client.db(dbName);
        let DOCID = { _id: ObjectId.createFromHexString(criteria._id) };
        const docs = await findDocument(db, DOCID);
        res.status(200).render('details', { booking: docs[0] });
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

const handle_Edit = async (req, res, criteria) => {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
        const db = client.db(dbName);

        let DOCID = { '_id': ObjectId.createFromHexString(criteria._id) };
        let docs = await findDocument(db, DOCID);

        if (docs.length > 0 && docs[0].userid == req.user.id) {
            res.status(200).render('edit', { booking: docs[0] });
        } else {
            res.status(500).render('info', { message: 'Unable to edit - you are not booking owner!' });
        }

	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

const updateDocument = async (db, criteria, updateData) => {
    var collection = db.collection('bookings');
    let results = await collection.updateOne(criteria, { $set: updateData });
    return results;
}

const handle_Update = async (req, res, criteria) => {
	try {
		await client.connect();
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
        res.status(200).render('info', {message: `Updated ${results.modifiedCount} document(s)`});
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

const handle_Create = async (req, res) => {
	try {
		await client.connect();
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

        await db.collection('bookings').insertOne(newDoc);
        res.redirect('/');
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

const handle_Delete = async (req, res) => {
	try {
		await client.connect();
        const db = client.db(dbName);
        let DOCID = { '_id': ObjectId.createFromHexString(req.query._id) };
        let docs = await findDocument(db, DOCID);
        if (docs.length > 0 && docs[0].userid == req.user.id) {   // user object by Passport.js
            await db.collection('bookings').deleteOne(DOCID);
            res.status(200).render('info', { message: `Booking ID ${docs[0].bookingid} removed.` });
        } else {
            res.status(500).render('info', { message: 'Unable to delete - you are not booking owner!' });
        }

	} catch(err) {
		console.error(err);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

// login page
app.get("/login", function (req, res) {
    res.send("<a href='/auth/facebook'>login through facebook</a>");
});

// send to facebook to do the authentication
app.get("/auth/facebook", passport.authenticate("facebook", { scope : "email" }));
// handle the callback after facebook has authenticated the user
app.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect : "/find",
        failureRedirect : "/"
}));

app.get('/', isLoggedIn, (req,res) => {
    res.redirect('/find');
})

app.get('/find', isLoggedIn, (req,res) => {
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
    res.status(200).render('create')
})
app.post('/create', isLoggedIn, (req, res) => {
    handle_Create(req, res);
});

app.get('/delete', isLoggedIn, (req,res) => {
    handle_Delete(req, res);
});


app.get('/api/booking/:bookingid', async (req,res) => {
	try {
		await client.connect();
        const db = client.db(dbName);
        const criteria = { bookingid: req.params.bookingid }
        let docs = await findDocument(db, criteria);
        res.status(200).json(docs);
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
});

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

const port = process.env.PORT || 8099;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
