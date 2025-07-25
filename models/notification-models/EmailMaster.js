const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const EmailDetails = sequelize.define('email_details', {
        emailDetailsId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        messageId: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING(50),
            validate: {
                notEmpty: {
                    msg: "To cannot be empty"
                }
            },
            allowNull: false,
        },
        subject: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        html: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sentAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        // success: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        // },
        error: {
            type: DataTypes.TEXT,
        },
        isRetried: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        schema: 'notifications',
        tableName: 'email_details',
        timestamps: false,
        underscored: true,
        comment: 'This table will be used to store information whenever user creates an account or updates his personal information.',
        freezeTableName: true,
        hasTrigger: true,
    })
    return EmailDetails;
}