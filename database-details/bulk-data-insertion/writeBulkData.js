const logger = require("../../utils/logger");
const getModel = require("../../utils/getModel");

async function insertGeneric(db, schemaName, modelName, bulkDataFilePath) {
    const t = await db.sequelize.transaction();
    try {
        const model = await getModel(db, schemaName, modelName);
        if (!model.success) {
            await t.rollback();
            throw new Error(model.message);
        }
        const Model = model.message;
        const bulkData = require(bulkDataFilePath);
        if (!Array.isArray(bulkData) || bulkData.length === 0) {
            await t.rollback();
            return { success: false, message: "Invalid bulk data" + bulkData.length };
        }
        const insertData = await Model.bulkCreate(bulkData, { transaction: t, returning: true });
        logger.info(`Number of records inserted in ${modelName} table: ` + bulkData.length);
        await t.commit();
        return { success: true, message: insertData };
    } catch (e) {
        if (t.finished !== "rollback") {
            await t.rollback();
        }
        logger.error(`Error inserting in ${modelName}: ${e}`);
        throw e;
    }
}

module.exports = { insertGeneric };