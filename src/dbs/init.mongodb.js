'use strict';

const mongoose = require('mongoose');
const {countConnect} = require('../helpers/check.connect')
const {db :{host , name , port}} = require('../config/config.mongodb')
const connectStrinn = `mongodb://${host}:${port}/${name}`

class Database {
    constructor(){
        this.connect()
    }
    connect(type ='mongodb') {
        if(1 == 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectStrinn,{
            maxPoolSize:50
        }).then(_=> console.log('Connect Mongodb Success', countConnect())).catch(_=> console.log('Connect Failed'))
    }
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb;

