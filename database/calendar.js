const MODEL_NAME = 'Calendar'

module.exports = (sequelize, DataTypes) => {
    const Calendar = sequelize.define(MODEL_NAME, {
        url: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        version: DataTypes.BIGINT
    })

    Calendar.associate = models => {
        models[MODEL_NAME].hasMany(models.Event)
    }

    return Calendar
}
