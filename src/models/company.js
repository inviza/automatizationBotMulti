const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    locationLink: {
        type: String,
        required: true
    }, 
    welkomeMessage: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    photoBot: {
        type: Buffer
    }
})

const Company = mongoose.model('Company', companySchema);

module.exports = Company