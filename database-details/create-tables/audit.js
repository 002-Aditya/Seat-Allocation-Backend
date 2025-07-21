const initialize = async (sequelize, DataTypes) => {
    const AuditMaster = require('../../models/audit-models/AuditMaster')(sequelize, DataTypes);
    await AuditMaster.sync({ force: false });

    return {
        logger_actions: AuditMaster,
    };
};

module.exports = { initialize };