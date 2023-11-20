const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const fs = require('fs');
const formidable = require('express-formidable');
const mongourl = 'mongodb://root:password@mongo:27017/test?authMechanism=DEFAULT&authSource=admin'
const dbName = 'test';

app.use(formidable());
app.set('view engine', 'ejs');

// Passport.js
const passport            = require('passport');
const FacebookStrategy    = require('passport-facebook').Strategy;
const session             = require('express-session');

const facebookAuth = {
      'clientID'        : '', // facebook App ID
      'clientSecret'    : '', // facebook App Secret
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

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (req, res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('list',{nBookings: docs.length, bookings: docs, username: req.user.name});
        });
    });
}

const handle_Details = (req, res, criteria) => {
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
            res.status(200).render('details', {booking: docs[0]});
        });
    });
}

const handle_Edit = (req, res, criteria) => {
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
            if (docs[0].userid == req.user.id) {
                res.status(200).render('edit',{booking: docs[0]});
            } else {
                res.status(500).render('info',{message:'Unable to edit - you are not booking owner!'})
            }
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
    var DOCID = {};
    DOCID['_id'] = ObjectID(req.fields._id);
    var updateDoc = {};
    updateDoc['bookingid'] = req.fields.bookingid;
    updateDoc['mobile'] = req.fields.mobile;
    if (req.files.filetoupload.size > 0) {
        fs.readFile(req.files.filetoupload.path, (err,data) => {
            assert.equal(err,null);
            updateDoc['photo'] = new Buffer.from(data).toString('base64');
            updateDocument(DOCID, updateDoc, (results) => {
                res.status(200).render('info', {message: `Updated ${results.result.nModified} document(s)`})
            });
        });
    } else {
        updateDocument(DOCID, updateDoc, (results) => {
            res.status(200).render('info', {message: `Updated ${results.result.nModified} document(s)`})
        });
    }
}

/*
app.use((req,res,next) => {
    let d = new Date();
    console.log(`TRACE: ${req.path} was requested at ${d.toLocaleDateString()}`);  
    next();
})
*/

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

app.post('/create', isLoggedIn, (req,res) => {
    console.log(req.user)
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null,err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let newDoc = {};
        // user object by Passport.js
        newDoc['userid'] = req.user.id;
        //
        newDoc['bookingid'] = req.fields.bookingid;
        newDoc['mobile'] = req.fields.mobile;
        if (req.files.filetoupload && req.files.filetoupload.size > 0) {
            fs.readFile(req.files.filetoupload.path, (err,data) => {
                assert.equal(err,null);
                newDoc['photo'] = new Buffer.from(data).toString('base64');
                db.collection('bookings').insertOne(newDoc,(err,results) => {
                    assert.equal(err,null);
                    client.close()
                    res.redirect('/')
                })
            });
        } else {
            db.collection('bookings').insertOne(newDoc,(err,results) => {
                assert.equal(err,null);
                client.close()
                res.redirect('/')
            })
        }
    })
})

app.get('/delete', isLoggedIn, (req,res) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(req.query._id)
        let cursor = db.collection('bookings').find(DOCID);
        cursor.toArray((err,docs) => {
            assert.equal(err,null);
            if (docs[0].userid == req.user.id) {   // user object by Passport.js
                db.collection('bookings').deleteOne(DOCID,(err,results) => {
                    assert.equal(err,null)
                    client.close()
                    res.status(200).render('info', {message: `Booking ID ${docs[0].bookingid} removed.`})
                })
            } else {
                client.close()
                res.status(500).render('info',{message:'Unable to delete - you are not booking owner!'})
            }
        });
    });
})


app.get('/api/booking/:bookingid', (req,res) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let criteria = {}
        criteria.bookingid = req.params.bookingid
        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).json(docs)
        });
    });
})

app.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

app.listen(process.env.PORT || 8099);
