const logger = require('../utils/logger');
const creatingSchema = require('./schema-creation');
const authSchema = require('./create-tables/auth');
const configSchema = require('./create-tables/config');

const initializeDatabase = async (sequelize, DataTypes, db) => {
    try {
        // Create schemas from here only
        await creatingSchema(sequelize, DataTypes);

        // Create tables from here
        db.auth = await authSchema.initialize(sequelize, DataTypes);
        db.config = await configSchema.initialize(sequelize, DataTypes);

        logger.info('Database schemas and models initialized successfully');
    } catch (err) {
        logger.error('Database initialization error', err);
        throw err;
    }
};

module.exports = initializeDatabase;