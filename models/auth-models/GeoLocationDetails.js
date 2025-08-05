const { Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const GeolocationDetails = sequelize.define('user_geolocation_details', {
        geoLocationId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            unique: true,
        },
        range: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true
        },
        country: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        timezone: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        latitudeLongitude: {
            type: DataTypes.GEOGRAPHY('POINT', 4326),
            allowNull: false
        },
        area: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'user_master',
                    schema: 'auth',
                },
                key: 'user_id',
            }
        },
        isLocalHost: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        }
    },
    {
        schema: 'auth',
        tableName: 'user_geolocation_details',
        timestamps: false,
        comment: 'This table will store user geolocation details.',
        underscored: true,
        hasTrigger: true,
        freezeTableName: true,
    });
    return GeolocationDetails;
}