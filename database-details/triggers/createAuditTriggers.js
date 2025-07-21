const logger = require('../../utils/logger');

/**
 * Auto-generates and runs audit trigger creation SQL for all user-defined tables
 */
async function createAuditTriggers(db) {
    const [results] = await db.sequelize.query(`
        SELECT
            'CREATE OR REPLACE TRIGGER '
            || quote_ident(table_name || '_tgr')
            || ' BEFORE UPDATE OR DELETE ON '
            || quote_ident(table_schema) || '.' || quote_ident(table_name)
            || ' FOR EACH ROW EXECUTE FUNCTION audit.auditFn();' AS trigger_creation_query
        FROM information_schema.tables
        WHERE
            table_schema NOT IN ('pg_catalog', 'information_schema')
            AND table_schema NOT LIKE 'pg_toast%'
            AND table_type = 'BASE TABLE'
    `);

    for (const row of results) {
        try {
            await db.sequelize.query(row.trigger_creation_query);
            logger.info(`Trigger has been created successfully: ${row.trigger_creation_query}`);
        } catch (err) {
            if (err.message.includes('already exists')) {
                logger.info(`Trigger already exists: skipping`);
            } else {
                logger.error(`Failed to create trigger:\n${row.trigger_creation_query}\nError: ${err.message}`);
            }
        }
    }
}

module.exports = createAuditTriggers;