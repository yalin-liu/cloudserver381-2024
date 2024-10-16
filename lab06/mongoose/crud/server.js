const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const uri = ''
const mongoose = require('mongoose');

const contactSchema = require('./models/contact');
const Contact = mongoose.model('contact', contactSchema);

const createContact = async () => {
    const raymond = new Contact({name: 'Raymond', birthyear: 2000, phone: [{type: 'mobile', number: '12345678'}], email: "student@gmail.com"});
    const createResult = await raymond.save();
    console.log(createResult)
    console.log('Contact created!');
}

const readContact = async () => {
    const criteria = {name: 'Raymond'};
    const searchResult = await Contact.find(criteria);
    console.log(`# documents meeting the criteria ${JSON.stringify(criteria)}: ${searchResult.length}`);
    console.log(searchResult);

    for (var doc of searchResult) {
        for (phone of doc.phone) {
            console.log(`type: ${phone.type} - ${phone.number}`);
        }
    }
}

const updateContact = async () => {
    const searchResult = await Contact.findOne({name: 'Raymond'});
    console.log(searchResult);

    // change phone number
    searchResult.phone[0].number = '19971999';

    let updateResult = await searchResult.save();
    console.log('Contact updated!');
    console.log(updateResult);

}

const deleteContact = async () => {
    const deleteResult = await Contact.deleteMany({name: 'Raymond'});
    console.log('Contact deleted!');
    console.log(deleteResult);
    console.log(`Total deleted: ${deleteResult.deletedCount}`);
}

async function main() {
    // Connect mongodb
    await mongoose.connect(uri);
    console.log('Mongoose Connected!')
}

main()
  .then(console.log('CRUD Sample'))
  .then(createContact)
  .then(readContact)
  .then(updateContact)
  .then(deleteContact)
  .catch((err) => console.log(err))
  .finally()