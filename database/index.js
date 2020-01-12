const {Sequelize} = require('sequelize')
const fs = require('fs')
const path = require('path')

const utils = require('../utils')
const dbConfig = require('../config').database

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
})

const db = { }

fs.readdirSync(__dirname)
    .filter(file => (file !== path.basename(__filename)) && utils.isSource(file))
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
