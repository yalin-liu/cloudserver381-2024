const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const http = require('http');
const url = require('url');

const mongourl = '';

const bookingSchema = mongoose.Schema({ 
    bookingid: String,
    mobile: String
});

// Connect to MongoDB once at the start of the app
// useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

const handle_Find = async (res, criteria) => {
    try {
        const findResult = await Booking.find(criteria);
        res.writeHead(200, {"content-type":"text/html"});
        res.write(`<html><body><H2>Bookings (${findResult.length})</H2><ul>`);
        for (let doc of findResult) {
            res.write(`<li>Booking ID: <a href="/details?_id=${doc._id}">${doc.bookingid}</a></li>`);
        }
        res.end('</ul></body></html>');
    } catch (err) {
        console.error(err);
        res.writeHead(500, {"content-type":"text/html"});
        res.end('<html><body><h2>Error occurred while find bookings</h2></body></html>');
    } finally {
        // If you do that, The problem is because opening and closing connections can be resource-intensive and may slow down your application due to the overhead of establishing a new connection for each operation.
        // await mongoose.connection.close();
    }
}

const handle_Details = async (res, criteria) => {
    try {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = mongoose.Types.ObjectId.createFromHexString(criteria._id);
        const findResult = await Booking.findOne(DOCID);
        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body><ul>');
        res.write(`<H2>Booking Details</H2><hr>`);
        if (findResult) { // Check if findResult is not null
            res.write(`<p>Booking ID: <b>${findResult.bookingid}</b></p>`);
            res.write(`<p>Mobile: <b>${findResult.mobile}</b></p>`);
            res.write(`<a href="/edit?_id=${findResult._id}">edit</a><br><br>`);
            res.write(`<a href="/find">back<a>`);
        } else {
            res.write('<p>No booking found with the provided ID.</p>');
        }

        res.end('</body></html>');
    } catch (err) {
        console.error(err);
        res.writeHead(500, {"content-type":"text/html"});
        res.end('<html><body><h2>Error occurred while find bookings details</h2></body></html>');
    } finally {
        // If you do that, The problem is because opening and closing connections can be resource-intensive and may slow down your application due to the overhead of establishing a new connection for each operation.
        // await mongoose.connection.close();
    }
}

const handle_Edit = async (res, criteria) => {
    try {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = mongoose.Types.ObjectId.createFromHexString(criteria._id);
        const findResult = await Booking.findOne(DOCID);
        res.writeHead(200, {"content-type":"text/html"});
        res.write('<html><body>');
        res.write('<form action="/update" method="GET">');
        if (findResult) { // Check if findResult is not null
            res.write(`Booking ID: <input name="bookingid" value="${findResult.bookingid}"><br>`);
            res.write(`Mobile: <input name="mobile" value="${findResult.mobile}"><br>`);
            res.write(`<input type="hidden" name="_id" value="${findResult._id}">`);
            res.write('<input type="submit" value="update">');
        } else {
            res.write('<p>No booking found with the provided ID.</p>');
        }
        res.end('</form></body></html>');
    } catch (err) {
        console.error(err);
        res.writeHead(500, {"content-type":"text/html"});
        res.end('<html><body><h2>Error occurred while editing booking details</h2></body></html>');
    } finally {
        // If you do that, The problem is because opening and closing connections can be resource-intensive and may slow down your application due to the overhead of establishing a new connection for each operation.
        // await mongoose.connection.close();
    }
}

const handle_Update = async (res, criteria) => {
    try {
        /* use Document ID for query */
        let DOCID = {};
        DOCID['_id'] = mongoose.Types.ObjectId.createFromHexString(criteria._id);
        const findResult = await Booking.findOne(DOCID);
        if (findResult) {
            // Update fields
            findResult.bookingid = criteria.bookingid;
            findResult.mobile = criteria.mobile;
            await findResult.save();

            res.writeHead(200, {"content-type":"text/html"});
            res.write(`<html><body><p>Updated document(s)</p><br>`);
            res.end('<a href="/">back</a></body></html>');
        } else {
            res.writeHead(404, {"content-type":"text/html"});
            res.end('<html><body><p>No document found with the provided ID.</p></body></html>');
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, {"content-type":"text/html"});
        res.end('<html><body><h2>Error occurred while editing booking details</h2></body></html>');
    } finally {
        // If you do that, The problem is because opening and closing connections can be resource-intensive and may slow down your application due to the overhead of establishing a new connection for each operation.
        // await mongoose.connection.close();
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
