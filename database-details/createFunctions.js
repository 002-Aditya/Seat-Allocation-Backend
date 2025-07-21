const logger = require("../utils/logger");

exports.createFunctions = async (db) => {
    try {
        const getLovFunction = require("./functions/getLov");
        const createAuditFunction = require("./functions/auditFn");
        await db.sequelize.query(getLovFunction.getLovFunction);
        await db.sequelize.query(createAuditFunction.auditFn);
        logger.info(`Functions have been created`);
    } catch (error) {
        logger.error(error);
    }
};