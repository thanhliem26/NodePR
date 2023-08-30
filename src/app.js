const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

//encode data when use method post
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//init middleware
app.use(morgan("dev"))
app.use(helmet()) //hidden framework using
app.use(compression())

//init db
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect');
checkOverload();

//init route
app.use('/', require('./routers'))
//handle errors

module.exports = app;