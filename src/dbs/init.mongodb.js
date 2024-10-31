'use strict';

const mongoose = require('mongoose');

const connectStrinn = `mongodb://localhost:27017/ShopDev`

class Database {
    constructor(){
        this.connect()
    }
    connect(type ='mongodb') {
        if(1 == 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectStrinn).then(_=> console.log('Connect Mongodb Success')).catch(_=> console.log('Connect Failed'))
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

