const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const http = require('http');
const url = require('url');

const mongourl = '';
const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({ 
    name: {type: String, required: true, minlength: 1, maxlength: 20},
    birthyear: {type: Number, min: 1900, max: 2100},
    phone: [{
        type: {type: String, enum: ['office','home','mobile'], default: 'mobile', required: true},
        number: {type: String, required: true}
    }],
    email: String
});

const create = () => {
    mongoose.connect(mongourl, {useMongoClient: true});
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        const Contact = mongoose.model('contact', contactSchema);
    
        // create a contact
        const raymond = new Contact({name: 'Raymond', phone: [{type: 'mobile', number: '12345678'}]});
    
        raymond.save((err) => {
            if (err) throw err;
            console.log('Contact created!');
            db.close();
            read();
        })
    })
}

const read = () => {
    mongoose.connect(mongourl, {useMongoClient: true});
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        const Contact = mongoose.model('contact', contactSchema);

        const criteria = {name: 'Raymond'};
        Contact.find(criteria, (err, results) => {
            console.log(`# documents meeting the criteria ${JSON.stringify(criteria)}: ${results.length}`);
            for (var doc of results) {
                console.log(doc.name);
                for (phone of doc.phone) {
                    console.log(`type: ${phone.type} - ${phone.number}`)
                }
            }
            db.close();
        })
    })
}

const update = () => {
    mongoose.connect(mongourl, {useMongoClient: true});
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        const Contact = mongoose.model('contact', contactSchema);

        Contact.findOne({name: 'Raymond'}, (err, results) => {
            // change phone number
            results.phone[0].number = '19971997';
            results.save((err) => {
                if (err) throw err
                console.log('Contact updated!');
                db.close();
                read();
            })
        })
    })
}

const del = () => {
    mongoose.connect(mongourl, {useMongoClient: true});
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
        const Contact = mongoose.model('contact', contactSchema);

        Contact.deleteMany({name: 'Raymond'}, (err) => {
            if (err) throw err;
            db.close();
            read();
        })
    })
}

