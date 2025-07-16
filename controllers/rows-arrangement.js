// Using the row arrangement service layer for applying CRUD operations on data in the row table
const RowsArrangementService = require('../services/config/rows-arrangement');
const logger = require('../utils/logger');

async function createRows(req, res) {
    try {
        const rowsArrangementData = req.body;
        if (!req.body || req.body.length === 0) {
            logger.error("Rows arrangement data is not provided");
            return res.status(400).send({ success: false, message: "Rows arrangement data is not provided" });
        }
        const userId = req.userId;
        const rowsArrangement = await RowsArrangementService.createRowsArrangement(rowsArrangementData, userId);
        if (!rowsArrangement.success) {
            return res.status(500).send(rowsArrangement);
        }
        return res.status(201).send(rowsArrangement.message);
    } catch (e) {
        logger.error("Error occurred while creating rows arrangement", e);
        return res.status(500).send({ success: false, message: e.message });
    }
}

async function getAllRows(req, res) {
    try {
        const rowsArrangement = await RowsArrangementService.findAllRowsArrangement();
        return res.status(200).send(rowsArrangement.rowsArrangement);
    } catch (e) {
        logger.error("Error occurred while fetching all rows arrangement", e);
        return res.status(500).send({ success: false, message: e.message });
    }
}

async function findRowsById(req, res) {
    const rowsId = req.query.rowId;
    try {
        if (!rowsId || rowsId.length === 0) {
            return res.status(400).send({ success: false, message: "Rows id is not provided" });
        }
        const rowsArrangement = await RowsArrangementService.findRowsArrangementById(rowsId);
        if (!rowsArrangement.success) {
            return res.status(400).send(rowsArrangement);
        }
        return res.status(200).send(rowsArrangement.rowsArrangement);
    } catch (e) {
        logger.error(`Error occurred while fetching rows arrangement by id ${rowsId}`, e);
        return res.status(500).send({ success: false, message: e.message });
    }
}

async function updateRows(req, res) {
    try {
        const userId = req.userId;
        const rowId = req.query.rowId;
        const rowsArrangementData = req.body;
        if (!rowsArrangementData || rowsArrangementData.length === 0) {
            return res.status(400).send({ success: false, message: "Rows arrangement data or row id is not provided" });
        }
        const updatedRowsArrangement = await RowsArrangementService.updateRowsArrangement(rowId, rowsArrangementData, userId);
        if (!updatedRowsArrangement.success) {
            return res.status(500).send(updatedRowsArrangement);
        }
        return res.status(201).send(updatedRowsArrangement.message);
    } catch (e) {
        logger.error("Error occurred while updating rows", e);
        return res.status(500).send({ success: false, message: e.message });
    }
}

module.exports = {
    createRows,
    getAllRows,
    findRowsById,
    updateRows,
};