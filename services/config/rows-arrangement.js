const db = require("../../utils/db-init");
const logger = require("../../utils/logger");

// Creating a service object for encapsulating CRUD operations
const RowsArrangementService = {

    // Helper function to fetch RowsArrangementModel only if it exists after getting the whole db initialized
    async getRowsArrangementModel() {
        try {
            const db = await require("../../utils/db-init");
            if (!db.config || !db.config.RowsArrangement) {
                logger.error("Rows arrangement model not found");
                return { success: false, message: "Rows arrangement model not found" };
            }
            return db.config.RowsArrangement;
        } catch (e) {
            logger.error("Error occurred while fetching rows arrangement model", e);
            return { success: false, message: e.message };
        }
    },

    async createRowsArrangement(rowsArrangementData) {
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const rowsArrangement = await RowsArrangement.create(rowsArrangementData);
            logger.info("Rows arrangement created successfully" + rowsArrangement.rowsId);
            return { success: true, message: "Rows arrangement created successfully" };
        } catch (e) {
            logger.error("Error occurred while creating rows arrangement", e);
            return { success: false, message: e.message };
        }
    },

    async findRowsArrangementById(rowsArrangementId) {
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const rowsArrangement = await RowsArrangement.findByPk(rowsArrangementId);
            if (!rowsArrangement) {
                logger.warn(`Rows arrangement not found for id ${rowsArrangementId}`);
                return { success: false, message: "Rows arrangement not found" };
            }
            logger.info(`Rows arrangement found for id ${rowsArrangementId}`);
            return { success: true, message: "Rows arrangement found", rowsArrangement };
        } catch (e) {
            logger.error(`Error occurred while finding rows arrangement by id ${rowsArrangementId}`, e);
            return { success: false, message: e.message };
        }
    },

    async findAllRowsArrangement() {
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const rowsArrangement = await RowsArrangement.findAll();
            return { success: true, message: "Rows arrangement found", rowsArrangement };
        } catch (e) {
            logger.error("Error occurred while finding all rows arrangement", e);
            return { success: false, message: e.message };
        }
    }
};

module.exports = RowsArrangementService;