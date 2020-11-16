const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'regular'
    }, 
    description: {
        type: String,
    },
    price: {
        type: Number,

    },
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Section'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    photo: {
        type: Buffer
    },

}, {
    timestamps : true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product