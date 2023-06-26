const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const http = require('http');
const url = require('url');

const mongourl = '';
const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({ 
    bookingid: String,
    mobile: String
});

const handle_Find = (res, criteria) => {
    mongoose.connect(mongourl, {useMongoClient: true});
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        const Booking = mongoose.model('booking',bookingSchema);
        Booking.find(criteria, (err,results) => {
            if (err) return console.error(err);
            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><H2>Bookings (${results.length})</H2><ul>`);
            for (var doc of results) {
                res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
            }
            res.end('</ul></body></html>');
            console.log("Closed DB connection");
            db.close();
        })
    })
}

const handle_Details = (res, criteria) => {
    mongoose.connect(mongourl, {useMongoClient: true});

    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        const Booking = mongoose.model('booking',bookingSchema);
        Booking.findOne(criteria, (err,results) => {
            if (err) return console.error(err);
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body><ul>');
            //console.log(docs);
            res.write(`<H2>Booking Details</H2><hr>`)
            res.write(`<p>Booking ID: <b>${results.bookingid}</b></p>`);
            res.write(`<p>Mobile: <b>${results.mobile}</b></p>`)
            // Q1
            res.write(`<a href="/edit?_id=${results._id}">edit</a><br><br>`)
            //
            res.write(`<a href="/find">back<a>`);
            res.end('</body></html>');
            db.close();
        });
    });
}

const handle_Edit = (res, criteria) => {
    mongoose.connect(mongourl, {useMongoClient: true});
    
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        const Booking = mongoose.model('booking',bookingSchema);
        Booking.findOne(criteria, (err,results) => {
            if (err) return console.error(err);
            res.writeHead(200, {"content-type":"text/html"});
            res.write('<html><body>');
            res.write('<form action="/update" method=GET>');
            res.write(`Booking ID: <input name="bookingid" value=${results.bookingid}><br>`);
            res.write(`Mobile: <input name="mobile" value=${results.mobile} /><br>`);
            res.write(`<input type="hidden" name="_id" value=${results._id}>`)
            res.write(`<input type="submit" value="update">`);
            res.end('</form></body></html>');
            db.close();
        });
    });
}

const handle_Update = (res, criteria) => {
    mongoose.connect(mongourl, {useMongoClient: true});
    
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        const Booking = mongoose.model('booking',bookingSchema);
        Booking.findOne(DOCID, (err,results) => {
            //console.log(results);
            results.bookingid = criteria.bookingid;
            results.mobile = criteria.mobile;
            results.save(err => {
                res.writeHead(200, {"content-type":"text/html"});
                res.write(`<html><body><p>Updated document(s)<p><br>`);
                res.end('<a href="/">back</a></body></html>');
                db.close();
            })
        })
    })
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