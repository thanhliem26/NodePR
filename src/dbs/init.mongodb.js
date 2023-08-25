'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = 'mongodb://localhost:27017/ShopDev';

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        //dev
        if (true) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString, {maxPoolSize: 50}).then((_) => console.log("connected mongoDB", countConnect()))
        .catch((err) => console.log("error connect"))
    }

    static getIntance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instance = Database.getIntance();
module.exports = instance;