const initialize = async (sequelize, DataTypes) => {
    const RowsArrangement = require('../../models/config-models/RowsArrangement')(sequelize, DataTypes);
    await RowsArrangement.sync({ force: true });

    return {
        RowsArrangement
    };
};

module.exports = { initialize };