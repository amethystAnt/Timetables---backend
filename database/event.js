const MODEL_NAME = 'Event'

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define(MODEL_NAME, {
        start: DataTypes.TEXT,
        end: DataTypes.TEXT,
        location: DataTypes.TEXT,
        summary: DataTypes.TEXT,
        version: DataTypes.INTEGER,
        deleted: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false 
        }
    })

    Event.associate = models => {
        models[MODEL_NAME].belongsTo(models.Calendar, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Event
}