const express = require('express')
const https = require('https')
const fs = require('fs')

const config = require('./config')
const database = require('./database')

const app = express()
require('./routes')(app)

function onListening() {
    console.log(`Listening on port ${config.server.port}.`)
}

/**
 * How to make the server run on production:
 *  - add a new configuration to config.js named release, set port number to 443
 *  - generate key.pem and cert.pem using openSSL and put password into the object 
 *      passed to https.createServer (below)
 *  - export your environment variable NODE_ENV as release and run this script with node
 */
function startServer() {
    if (process.env.NODE_ENV === 'release') {
        https.createServer(
            {
                key: fs.readFileSync('./key.pem'),
                cert: fs.readFileSync('./cert.pem'),
                passphrase: ''
            }, 
            app
        )
            .listen(config.server.port)
            .addListener('error', error => {
                console.log(error)
            })
            .addListener('listening', () => {
                onListening()
            })
    } else {
        app.listen(config.server.port, error => {
            if (error) { console.log(error) }
            onListening()
        })
    }
}

database.sequelize.sync().then(() => {
    startServer()
})
