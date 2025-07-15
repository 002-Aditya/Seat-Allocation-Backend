const initialize = async (sequelize, DataTypes) => {
    const UserMaster = require('../../models/auth-models/UserMaster')(sequelize, DataTypes);
    await UserMaster.sync({ force: false });
    return {
        user_master: UserMaster
    };
};
module.exports = { initialize };