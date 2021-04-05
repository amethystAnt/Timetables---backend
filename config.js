const config = {
    alpha: {
        url: '',
        server: {
            port: 80
        },
        database: {
            user: 'timetablesalpha',
            host: 'localhost',
            password: 'alphapasswd',
            database: 'timetablesalpha',
            dialect: 'mysql'
        }
    },
}

module.exports = config[process.env.NODE_ENV || 'alpha']
