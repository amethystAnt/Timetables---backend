const express = require('express')

const config = require('./config')
const database = require('./database')

const app = express()
require('./routes')(app)

database.sequelize.sync().then(() => {
    app.listen(config.server.port, error => {
        if (error) { console.log(error) }
        console.log(`Listening on port ${config.server.port}.`)
    })    
})
