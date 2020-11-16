const express = require('express');
require('./db/mongoose')
const sectionRouter = require('./routers/section');
const productRouter = require('./routers/product');
const companyRouter = require('./routers/company');
const userRouter = require('./routers/user');


const app = express();

app.use(express.json());
app.use(userRouter);
app.use(sectionRouter);
app.use(productRouter);
app.use(companyRouter);

module.exports = app