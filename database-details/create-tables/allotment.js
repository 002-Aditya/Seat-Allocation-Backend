const initialize = async (sequelize, DataTypes) => {
    const Bookings = require('../../models/allotment-models/Bookings')(sequelize, DataTypes);
    await Bookings.sync({ force: true });

    return {
        bookings: Bookings,
    };
};

module.exports = { initialize };