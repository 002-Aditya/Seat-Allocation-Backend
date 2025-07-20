const initialize = async (sequelize, DataTypes) => {
    const Bookings = require('../../models/allotment-models/Bookings')(sequelize, DataTypes);
    await Bookings.sync({ force: false });

    return {
        bookings: Bookings,
    };
};

module.exports = { initialize };