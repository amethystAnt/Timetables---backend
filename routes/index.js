const fs = require('fs')
const path = require('path')

const utils = require('../utils')

module.exports = app => {
    fs.readdirSync(__dirname).forEach(file => {
        if (file !== path.basename(__filename) && utils.isSource(file)) {
            require(path.join(__dirname, file.substr(0, file.lastIndexOf('.'))))(app)
        }
    })
}
