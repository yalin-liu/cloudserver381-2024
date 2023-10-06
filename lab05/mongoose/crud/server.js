const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const mongourl = ''
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
    mongoose.connect(mongourl);
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
        const Contact = mongoose.model('contact', contactSchema);
    
        try {
            // create a contact
            const raymond = new Contact({name: 'Raymond', phone: [{type: 'mobile', number: '12345678'}]});
            const createResult = await raymond.save();
            console.log(createResult)
            console.log('Contact created!');
        } catch (err) {
            console.error(err);
        } finally {
            db.close();
            read();
        }
    });
}

const read = () => {
    mongoose.connect(mongourl);
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
        const Contact = mongoose.model('contact', contactSchema);

        try {
            const criteria = {name: 'Raymond'};
            const searchResult = await Contact.find(criteria).exec();
            console.log(`# documents meeting the criteria ${JSON.stringify(criteria)}: ${searchResult.length}`);

            for (var doc of searchResult) {
                console.log(doc.name);
                for (phone of doc.phone) {
                    console.log(`type: ${phone.type} - ${phone.number}`);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            db.close();
        }
    });
}

const update = () => {
    mongoose.connect(mongourl);
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
        const Contact = mongoose.model('contact', contactSchema);

        try {
            const searchResult = await Contact.findOne({name: 'Raymond'}).exec();

            // change phone number
            searchResult.phone[0].number = '19971997';

            await searchResult.save();
            console.log('Contact updated!');
        } catch (err) {
            console.error(err);
        } finally {
            db.close();
            read();
        }
    });
}

const del = () => {
    mongoose.connect(mongourl);
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
        const Contact = mongoose.model('contact', contactSchema);

        try {
            await Contact.deleteMany({name: 'Raymond'});
            console.log('Contact deleted!');
        } catch (err) {
            console.error(err);
        } finally {
            db.close();
            read();
        }
    });
}


create();
// read();
// update();
// del();