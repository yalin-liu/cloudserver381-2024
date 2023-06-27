const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
const url = require('url');
 
const mongourl = '';
const dbName = 'test';
const client = new MongoClient(mongourl);
 
const criteria = {"bookingid": "BK001"};


const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    cursor.forEach((doc) => {
        callback(doc);
    });
}

client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    findDocument(db, criteria, (doc) => {
        client.close();
        console.log("Closed DB connection");
        console.log(doc);
        
    })
});

/*
const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    cursor.toArray((err,docs) => {
        assert.equal(null,err);
        callback(docs);
    })
}

client.connect((err) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    findDocument(db, criteria, (docs) => {
        client.close();
        console.log("Closed DB connection");
        for (doc of docs) {
            console.log(doc);
        }
    })
});
*/