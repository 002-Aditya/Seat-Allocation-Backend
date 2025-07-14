const initialize = async (sequelize, DataTypes) => {
    const Bookings = require('../../models/allotment-models/Bookings')(sequelize, DataTypes);
    await Bookings.sync({ force: true });

    return {
        Bookings,
    };
};

module.exports = { initialize };