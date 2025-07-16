const logger = require("../utils/logger");

exports.createFunctions = async (db) => {
    try {
        const getLovFunction = require("./functions/getLov");
        await db.sequelize.query(getLovFunction.getLovFunction);
        logger.info(`Functions have been created`);
    } catch (error) {
        logger.error(error);
    }
};