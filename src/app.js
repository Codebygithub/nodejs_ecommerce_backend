require('dotenv').config()
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const helmets = require('helmet')
const app = express();



//init middleware
app.use(morgan("dev"))
app.use(helmets())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

//init database

require('./dbs/init.mongodb')
const  {countConnect , checkOverload} = require('./helpers/check.connect')
countConnect()
// checkOverload()
//init routes
app.use('/',require('./routes'))

//handle error

module.exports =app