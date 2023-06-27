const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';
const client = new MongoClient(mongourl);
 
const criteria = {"bookingid": "BK001"};
const changes = {"mobile": "87654321"}

const findDocument = (db, criteria, callback) => {
    db.collection('bookings').updateMany(criteria,{$set: changes}, (err,results) => {
        assert.equal(err,null);
        //console.log(results);
        console.log(`Updated document(s): ${results.result.nModified}`)
        callback();
    });
}

client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    findDocument(db, criteria, () => {
        client.close();
        console.log("Closed DB connection");
    })
});