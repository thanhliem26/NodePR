const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

//init middleware
app.use(morgan("dev"))
app.use(helmet()) //hidden framework using
app.use(compression())

//init db
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect');
checkOverload();

//init route
app.get('/', (req, res, next) => {
    const helloWorld = 'Hello word';

    return res.status(200).json({
        message: 'Hello word',
        metaData: helloWorld.repeat(100000)
    })
})
//handle errors

module.exports = app;