// const { authModels } = require('./create-tables/auth');
// const { configModels } = require('./create-tables/config');
// const logger = require('../utils/logger');
// const db = require('../utils/db-init');
//
// const creatingTables = async (sequelize, DataTypes) => {
//     try {
//         await db.sequelize.sync({ force: false }).then(async () => {
//             // await authModels.users.create({ force: true });
//             // await configModels.rowsArrangement.create({ force: true });
//             logger.info(`Tables created`);
//         })
//     } catch (e) {
//         logger.error("Unexpected error while creating schemas: " + e);
//     }
// };
//
// module.exports = creatingTables;