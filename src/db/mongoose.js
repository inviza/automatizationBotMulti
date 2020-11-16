const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');


mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true,
    useCreateIndex: true
})


// const soapSea = new Product({
//     name: 'EDEIGMARIN',
//     type: 'KEK',
//     description: 'Наша адреса: м.Київ, Велика Васильківська, 43',
//     price: 241
// })

// const user = new User({ 
//     name: 'Katya',
//     surname: 'Dzuiba',
//     email: 'kewkew@gmail.com',
//     password: 'ktotudaidetkakzmur123453'
// })


// soapSea.save().then((respons) => {
//     console.log(respons)
// }).catch((error) => {
//     console.log(error)
// })

// user.save().then((respons) => {
//     console.log(respons)
// }).catch((error) => {
//     console.log(error)
// })



