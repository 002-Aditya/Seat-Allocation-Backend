const initialize = async (sequelize, DataTypes) => {
    const EmailMaster = require('../../models/notification-models/EmailMaster')(sequelize, DataTypes);
    const OtpMaster = require('../../models/notification-models/OtpDetails')(sequelize, DataTypes);
    await EmailMaster.sync({ force: false });
    await OtpMaster.sync({ force: true });

    return {
        email_master: EmailMaster,
        otp_details: OtpMaster,
    };
};

module.exports = { initialize };