const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

sectionSchema.virtual('products',{ 
    'ref': 'Product',
    localField: '_id',
    foreignField: 'section_id'
})

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;