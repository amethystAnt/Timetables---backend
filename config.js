const config = {
    mock : {
        url: '',
        mock : true,
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
    alpha: {
        url: '',
        mock: false,
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
