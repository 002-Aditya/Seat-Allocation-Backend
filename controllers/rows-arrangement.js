// Using the rows arrangement service layer for applying CRUD operations on data in the row table
const RowsArrangementService = require('../services/config/rows-arrangement');
const logger = require('../utils/logger');

async function createRows(req, res) {
    try {
        const rowsArrangementData = req.body;
        if (!req.body || req.body.length === 0) {
            logger.error("Rows arrangement data is not provided");
            return res.status(400).send({ success: false, message: "Rows arrangement data is not provided" });
        }
        const rowsArrangement = await RowsArrangementService.createRowsArrangement(rowsArrangementData);
        return res.status(201).send(rowsArrangement);
    } catch (e) {
        logger.error("Error occurred while creating rows arrangement", e);
        return res.status(500).send({ success: false, message: e.message });
    }
};

module.exports = {
    createRows
};