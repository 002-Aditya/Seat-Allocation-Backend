const initialize = async (sequelize, DataTypes) => {
    const EmailMaster = require('../../models/notification-models/EmailMaster')(sequelize, DataTypes);
    await EmailMaster.sync({ force: true });

    return {
        email_master: EmailMaster,
    };
};

module.exports = { initialize };