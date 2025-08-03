const initialize = async (sequelize, DataTypes) => {
    // Other login details
    const UserGeolocation = require('../../models/auth-models/GeoLocationDetails')(sequelize, DataTypes);
    const LoginDetails = require('../../models/auth-models/LoginDetails')(sequelize, DataTypes);
    const DeviceDetails = require('../../models/auth-models/DeviceDetails')(sequelize, DataTypes);

    // User Details
    const UserMaster = require('../../models/auth-models/UserMaster')(sequelize, DataTypes);

    await UserMaster.sync({ force: false });
    await LoginDetails.sync({ force: false });
    await UserGeolocation.sync({ force: false });
    await DeviceDetails.sync({ force: false });

    return {
        user_master: UserMaster,
        login_details: LoginDetails,
        user_geolocation: UserGeolocation,
        device_details: DeviceDetails,
    };
};
module.exports = { initialize };