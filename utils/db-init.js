const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');
const creatingSchema = require('../database-details/schema-creation');
const authSchema = require('../database-details/create-tables/auth');
const configSchema = require('../database-details/create-tables/config');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        // dialectOptions: {
        //     ssl: {
        //         require: false,
        //         rejectedUnauthorized: false // Add this line if you want to avoid self-signed certificate errors
        //     }
        // }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models after sync
db.sequelize.sync({ force: true }).then(async () => {
    await creatingSchema(sequelize, DataTypes);
    db.auth = await authSchema.initialize(sequelize, DataTypes);
    db.config = await configSchema.initialize(sequelize, DataTypes);
    logger.info('database -> Yes resync done');
}).catch((err) => {
    logger.error('database -> error', err);
});

module.exports = db;