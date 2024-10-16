var mongoose = require('mongoose');

const contactSchema = mongoose.Schema({ 
    name: {type: String, required: true, minlength: 1, maxlength: 20},
    birthyear: {type: Number, min: 1900, max: 2100},
    phone: [{
        type: {type: String, enum: ['office','home','mobile'], default: 'mobile', required: true},
        number: {type: String, required: true}
    }],
    email: String
});

module.exports = contactSchema;
