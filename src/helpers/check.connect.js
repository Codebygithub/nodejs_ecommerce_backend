'use strict';

const _SECONDS = 5000;
const mongoose = require('mongoose')
const os = require('os')
const process = require('process');


// count connections
const countConnect = ()=> {
    const numConnections = mongoose.connections.length
    console.log(`Number of connections ${numConnections}`)
}

// check over load 
const checkOverload = ()=>  {
    setInterval(()=> {
        const numConnections = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUse = process.memoryUsage().rss;
        const maxConnections = numCores * 4 

        console.log("Active connections: " + numConnections)
        console.log("Memory usage: " + memoryUse /1024 /1024 +  " MB")
        if(numConnections > maxConnections) {
            console.log(" Connect overloading detected")
        } 
    }, _SECONDS)

}
module.exports = {
    countConnect ,
    checkOverload
}