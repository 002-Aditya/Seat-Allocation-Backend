const initialize = async (sequelize, DataTypes) => {
    const RowsArrangement = require('../../models/config-models/RowsArrangement')(sequelize, DataTypes);
    await RowsArrangement.sync({ force: true });

    return {
        rows_arrangement: RowsArrangement
    };
};

module.exports = { initialize };