const insertMethods = require("./writeBulkData");
const logger = require("../../utils/logger");

exports.insertBulkData = async (db) => {
    try {
        await insertMethods.insertGeneric(db, "lov", "departments", "../../bulk-data/departments-data.js");
    } catch (error) {
        logger.error("Error while inserting bulk data:", error);
    }
};