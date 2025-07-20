const { Sequelize, DataTypes } = require('sequelize');
const { Client } = require('pg');
const logger = require('../logger');
const initializeDatabase = require('../../database-details/initialize-database');

async function createDatabaseIfNotExists() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_DATABASE]
        );

        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${process.env.DB_DATABASE}"`);
            logger.info(`Database ${process.env.DB_DATABASE} created successfully`);
        } else {
            logger.info(`Database ${process.env.DB_DATABASE} already exists`);
        }
    } catch (err) {
        logger.error('Error creating database', err);
        throw err;
    } finally {
        await client.end();
    }
}

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize database and models
createDatabaseIfNotExists()
    .then(() => {
        return db.sequelize.sync({ force: false });
    })
    .then(async () => {
        await initializeDatabase(sequelize, DataTypes, db);
        logger.info('Database -> Yes resync done');
    })
    .catch((err) => {
        logger.error('Database -> error', err);
    });

module.exports = db;