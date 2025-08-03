const initialize = async (sequelize, DataTypes) => {
    const UserMaster = require('../../models/auth-models/UserMaster')(sequelize, DataTypes);
    const GeolocationDetails = require('../../models/auth-models/GeoLocationDetails')(sequelize, DataTypes);
    const DeviceDetails = require('../../models/auth-models/DeviceDetails')(sequelize, DataTypes);
    const LoginDetails = require('../../models/auth-models/LoginDetails')(sequelize, DataTypes);

    await UserMaster.sync({ force: true });
    await GeolocationDetails.sync({ force: true });
    await DeviceDetails.sync({ force: true });
    await LoginDetails.sync({ force: true });

    return {
        user_master: UserMaster,
        login_details: LoginDetails,
        user_geolocation: GeolocationDetails,
        device_details: DeviceDetails,
    };
};

module.exports = { initialize };