const logger = require("./logger");

async function getModel(db, schemaName, modelName) {
    try {
        const db = await require("./db-init");
        const schema = db[schemaName];
        if (!schema) {
            logger.error(`Schema "${schemaName}" not found in database instance.`);
            return { success: false, message: `Schema "${schemaName}" not found.` };
        }
        const model = schema[modelName];
        if (!model) {
            logger.error(`Model "${modelName}" not found in schema "${schemaName}".`);
            return { success: false, message: `Model "${modelName}" not found in schema "${schemaName}".` };
        }
        return { success: true, message: model };
    } catch (e) {
        logger.error(`Error retrieving model "${modelName}" from schema "${schemaName}":`, e);
        return { success: false, message: e.message };
    }
}

module.exports = getModel;