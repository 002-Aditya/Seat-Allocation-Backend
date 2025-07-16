const initialize = async (sequelize, DataTypes) => {
    const RowsArrangement = require('../../models/config-models/RowsArrangement')(sequelize, DataTypes);
    await RowsArrangement.sync({ force: false });

    return {
        rows_arrangement: RowsArrangement
    };
};

module.exports = { initialize };