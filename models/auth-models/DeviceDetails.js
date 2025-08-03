const { Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const DeviceDetails = sequelize.define('user_device_details', {
        deviceDetailsId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            unique: true,
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        vendor: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        model: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        os: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        osVersion: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        browser: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        browserVersion: {
            type: DataTypes.TEXT,
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
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        }
    },
    {
        schema: 'auth',
        tableName: 'user_device_details',
        timestamps: false,
        comment: 'This table will store user device details like all the places where user has logged in from and its related information.',
        underscored: true,
        hasTrigger: true,
        freezeTableName: true,
    });
    return DeviceDetails;
}