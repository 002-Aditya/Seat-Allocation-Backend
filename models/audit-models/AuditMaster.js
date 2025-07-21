const { Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const AuditMaster = sequelize.define('logged_actions', {
            auditId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true,
                unique: true,
            },
            schemaName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            tableName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            actionPerformed: {
                type: DataTypes.ENUM('I', 'D', 'U'),
                allowNull: false,
            },
            oldValue: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            updatedBy: {
                type: DataTypes.UUID,
                references: {
                    model: {
                        tableName: 'user_master',
                        schema: 'auth',
                    },
                    key: 'user_id',
                },
                allowNull: false
            },
            actionTimeStamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            }
        },
        {
            schema: 'audit',
            tableName: 'logged_actions',
            timestamps: false,
            comment: 'This table will be storing the audit logs for all the tables which will be what was the old data that was updated.',
            underscored: true,
            hasTrigger: true,
            freezeTableName: true,
        });
    return AuditMaster;
}