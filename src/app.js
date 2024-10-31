const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const helmets = require('helmet')
const app = express();



//init middleware
app.use(morgan("dev"))
app.use(helmets())
app.use(compression())

//init database

require('./dbs/init.mongodb')

//init routes

//handle error

module.exports =app