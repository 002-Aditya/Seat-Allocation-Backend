const initialize = async (sequelize, DataTypes) => {
    const EmailMaster = require('../../models/notification-models/EmailMaster')(sequelize, DataTypes);
    const OtpMaster = require('../../models/notification-models/OtpDetails')(sequelize, DataTypes);
    await EmailMaster.sync({ force: false });
    await OtpMaster.sync({ force: false });

    return {
        email_master: EmailMaster,
    };
};

module.exports = { initialize };