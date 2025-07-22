const logger = require("../utils/logger");

exports.createExtensions = async (db) => {
    try {
        const extensions = require("./extensions/extensions");
        await db.sequelize.query(extensions.uuidExtension);
        logger.info(`Extensions have been created successfully.`);
    } catch (error) {
        logger.error(`Error occurred while creating extensions : ` + error);
    }
};