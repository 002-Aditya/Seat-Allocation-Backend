const initialize = async (sequelize, DataTypes) => {
    const UserMaster = require('../../models/master-models/UserMaster')(sequelize, DataTypes);
    await UserMaster.sync({ force: false });

    return {
        UserMaster
    };
};

module.exports = { initialize };