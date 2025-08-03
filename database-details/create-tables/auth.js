const initialize = async (sequelize, DataTypes) => {
    const UserMaster = require('../../models/auth-models/UserMaster')(sequelize, DataTypes);
    const LoginDetails = require('../../models/auth-models/LoginDetails')(sequelize, DataTypes);
    await UserMaster.sync({ force: false });
    await LoginDetails.sync({ force: false });
    return {
        user_master: UserMaster
    };
};
module.exports = { initialize };