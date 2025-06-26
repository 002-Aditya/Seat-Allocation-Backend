const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        'user_login_details', {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            empId: {
                type: DataTypes.INTEGER,
            },
            lastLoginDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdOn: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            createdBy: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            modifiedOn: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            modifiedBy: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        {
            schema: 'auth',
            tableName: 'user_login_details',
            timestamps: false,
            comment:
                'This is a table associated with users data and will contain all the data related to users. It will consist of user login information.',
            underscored: true,
            freezeTableName: true,
        }
    );
    return User;
};