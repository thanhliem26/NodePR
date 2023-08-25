'use strict'

const mongoose = require('mongoose');
const _SECONDS = 5000;
const os = require('os');
const process = require('process');
//count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log("countConnect ~ numConnection:", numConnection)
}

//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maxmium number of connection based on mumber of cores
        const maxConnections = numCores * 5;

        console.log("Active connection", numConnection)
        console.log(`Memory usage ${memoryUsage / 1024 / 1024} MB`)

        if(numConnection > maxConnections) {
            console.log("connection overload detected")
        }
    }, _SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
};