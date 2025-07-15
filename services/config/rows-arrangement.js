const db = require("../../utils/db-init");
const logger = require("../../utils/logger");
const { filterData } = require("../../utils/filter-data");

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

    async createRowsArrangement(rowsArrangementData, userId) {
        const t = await db.sequelize.transaction();
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const filterInput = await filterData([rowsArrangementData]);
            filterInput[0].createdBy = userId;
            const createdInstance = await RowsArrangement.create(filterInput[0], { transaction: t });
            const plainData = createdInstance.get({ plain: true });
            const filtered = await filterData([plainData]);
            logger.info("Rows arrangement created successfully with rows arrangement id : " + plainData.rowId);
            await t.commit();
            return { success: true, message: filtered[0] };
        } catch (e) {
            await t.rollback();
            logger.error("Error occurred while creating rows arrangement", e);
            return { success: false, message: e.message };
        }
    },

    async findRowsArrangementById(rowsArrangementId) {
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const rowsArrangement = await RowsArrangement.findByPk(rowsArrangementId, {
                raw: true,
                attributes: ['rowId', 'noOfSeats', 'department']
            });
            if (!rowsArrangement) {
                logger.warn(`Rows arrangement not found for id ${rowsArrangementId}`);
                return { success: false, message: `Rows arrangement for the given id, ${rowsArrangementId} was not found` };
            }
            return { success: true, message: "Rows arrangement found", rowsArrangement };
        } catch (e) {
            logger.error(`Error occurred while finding rows arrangement by id ${rowsArrangementId}`, e);
            return { success: false, message: e.message };
        }
    },

    async findAllRowsArrangement() {
        try {
            const RowsArrangement = await this.getRowsArrangementModel();
            const rowsArrangement = await RowsArrangement.findAll({
                attributes: ['rowId', 'noOfSeats', 'department']
            });
            return { success: true, message: "Rows arrangement found", rowsArrangement };
        } catch (e) {
            logger.error("Error occurred while finding all rows arrangement", e);
            return { success: false, message: e.message };
        }
    },

    async updateRowsArrangement(rowsArrangementId, rowsArrangementData) {
        const t = await db.sequelize.transaction();
        try {
            const RowsArrangement = await this.getRowsArrangementModel();

            // Check if the record exists
            const ifRowsArrangementExists = await this.findRowsArrangementById(rowsArrangementId);
            if (!ifRowsArrangementExists.success) {
                logger.warn(`Rows arrangement not found for id ${rowsArrangementId}`);
                await t.rollback();
                return ifRowsArrangementExists;
            }

            // Modifying the input as per our needs
            const filterInput = await filterData([rowsArrangementData]);
            filterInput.modifiedOn = new Date();
            filterInput.modifiedBy = "SYSTEM";

            // Updating the given record
            const [updatedCount, updatedRows] = await RowsArrangement.update(filterInput, {
                where: { rowId: rowsArrangementId },
                transaction: t,
                returning: true
            });

            // Check if any row was updated
            if (updatedRows.length === 0) {
                await t.rollback();
                return { success: false, message: "No rows were updated." };
            }

            // Fetching the instance which was updated instead of the whole result
            const updatedRowInstance = updatedRows[0];
            const plainData = updatedRowInstance.get({ plain: true });
            const filtered = await filterData([plainData]);
            logger.info("Rows arrangement updated successfully with rows arrangement id : " + plainData.rowId);
            await t.commit();
            return { success: true, message: filtered[0] };
        } catch (e) {
            await t.rollback();
            logger.error("Error occurred while updating rows arrangement", e);
            return {success: false, message: e.message};
        }
    }
};

module.exports = RowsArrangementService;