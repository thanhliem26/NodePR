'use strict'

const mongoose = require('mongoose');

const { countConnect } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../config/config.mongodb');
// const connectString = `mongodb://${host}:${port}/${name}`;\
const connectString = 'mongodb://127.0.0.1:27017/ShopDev';

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

        try {
            mongoose.connect(connectString, {maxPoolSize: 50}).then((_) => console.log("connected mongoDB", countConnect()))
            .catch((err) => console.log("error connect", err))
        } catch(e) {
            console.log("error: ", e)
        }

        
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
