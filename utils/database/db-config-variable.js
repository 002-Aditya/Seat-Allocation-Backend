// CREATE TRIGGER trg_my_table_audit
// AFTER UPDATE OR DELETE ON public.my_table
// FOR EACH ROW EXECUTE FUNCTION audit.auditFn();

/**
 * Utility to set the current user ID in the PostgreSQL session
 * for audit logging or trigger functions.
 */

module.exports = async function setCurrentUserId(sequelize, userId, transaction = null) {
    if (!userId) {
        throw new Error("userId is required to set app.current_user_id");
    }

    const query = `SET app.current_user_id = '${userId}'`;

    if (transaction) {
        await sequelize.query(query, { transaction });
    } else {
        await sequelize.query(query);
    }
};