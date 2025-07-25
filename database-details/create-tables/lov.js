const initialize = async (sequelize, DataTypes) => {
    const Departments = require('../../models/lov-models/Departments')(sequelize, DataTypes);
    await Departments.sync({ force: true });

    return {
        departments: Departments,
    };
};

module.exports = { initialize };