const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const UserMaster = sequelize.define('user_master', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        secondName: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        otherName: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        modifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        schema: 'auth',
        tableName: 'user_master',
        timestamps: false,
        comment: 'This table will store all the users information.',
        underscored: true,
        hasTrigger: true,
        freezeTableName: true,
    });
    return UserMaster;
}