const { Sequelize } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    const OtpDetails = sequelize.define('otp_details', {
        otpId: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'user_master',
                    schema: 'auth',
                },
                key: 'email',
            }
        },
        otp: {
            type: DataTypes.STRING(4),
            allowNull: false,
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 15 * 60 * 1000)
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        schema: 'notifications',
        tableName: 'otp_details',
        timestamps: false,
        underscored: true,
        comment: 'This table will be used for storing OTP that can be used only once for changing password or logging in.',
        freezeTableName: true,
        hasTrigger: true,
    })
    return OtpDetails;
};