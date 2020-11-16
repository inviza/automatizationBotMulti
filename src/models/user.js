const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const Section = require('./section');
const Product = require('./product');
const Company = require('./company');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: { 
        type: String, 
        // unique: true,
        required: true,
        trim: true,
        lowercase: true, 
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('It is invalid email')
            }
            // const result = this.model('User').countDocuments({ email: value }, function(err, count) {
            //     console.log('fdngbf', count)
            //     if (err) {
            //         throw new Error('gdggggggg',err);
            //     } 
            //     // If `count` is greater than zero, "invalidate"
            //     if(count){
            //         throw new Error('Email already exists')
            //     };
                
            // });
        }
    },
    
    
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {

            if(value.toLowerCase().includes('password')) {
                throw new Error('invalid password')
            }
        }
    },

    tokens: [{
        token:{
            type:String,
            required: true
        }
    }],
}, {
    timestamps : true
})
// userSchema.path('email').validate(function(value, done) {
//         this.model('User').count({ email: value }, function(err, count) {
//             if (err) {
//                 return done(err);
//             } 
//             // If `count` is greater than zero, "invalidate"
//             done(!count);
//         });
//     }, 'Email already exists');
userSchema.virtual('companyOwner',{ 
    'ref': 'Company',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('productOwner',{ 
    'ref': 'Product',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('sectionOwner',{ 
    'ref': 'Section',
    localField: '_id',
    foreignField: 'owner'
})

//* Static for mongoose model 

userSchema.statics.findByCredentials = async (email, password) => {


    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//* Method for examples of object(document)

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    
    const token = jwt.sign({'_id': user.id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//* PRE work 

userSchema.pre('save', async function (next) {
    const user = this;
    
    // console.log(user.isModified('password'))

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
}) 
userSchema.pre('remove', async function(next) {
    const user = this;
    
    // Section.deleteMany({owner: user._id})
    // Product.deleteMany({owner: user._id})
    // Company.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User