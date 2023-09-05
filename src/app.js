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
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
   const statusCode = error.status || 500
   
   return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
   })
})

module.exports = app;