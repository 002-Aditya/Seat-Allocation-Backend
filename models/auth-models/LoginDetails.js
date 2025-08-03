const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const LoginDetails = sequelize.define('login_details', {
        loginDetailsId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            unique: true,
        },
        locationId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'user_geolocation_details',
                    schema: 'auth',
                },
                key: 'geo_location_id',
            }
        },
        ipAddress: {
            type: DataTypes.INET,
            allowNull: false
        },
        loginTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        deviceDetailsId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'user_geolocation_details',
                    schema: 'auth',
                },
                key: 'device_details_id',
            }
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
        }
    }, {
        schema: 'auth',
        tableName: 'login_details',
        timestamps: false,
        comment: 'This table will be storing the login details of the users.',
        underscored: true,
        hasTrigger: true,
        freezeTableName: true,
    });
    return LoginDetails;
}