const logger = require('../utils/logger');
const creatingSchema = require('./schema-creation');
const authSchema = require('./create-tables/auth');
const configSchema = require('./create-tables/config');
const allotmentSchema = require('./create-tables/allotment');
const lovSchema = require('./create-tables/lov');
const { insertBulkData } = require('./bulk-data-insertion/insert-bulk-data');

const initializeDatabase = async (sequelize, DataTypes, db) => {
    try {
        // Create schemas from here only
        await creatingSchema(sequelize, DataTypes);

        // Create tables from here
        db.auth = await authSchema.initialize(sequelize, DataTypes);
        db.config = await configSchema.initialize(sequelize, DataTypes);
        db.allotment = await allotmentSchema.initialize(sequelize, DataTypes);
        db.lov = await lovSchema.initialize(sequelize, DataTypes);
        await insertBulkData(db);
        logger.info('Database schemas and models initialized successfully');
    } catch (err) {
        logger.error('Database initialization error', err);
        throw err;
    }
};

module.exports = initializeDatabase;