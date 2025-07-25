const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const RowsArrangement = sequelize.define('rows_arrangement', {
        rowId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
        },
        floorNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        noOfSeats: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        departmentId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'departments',
                    schema: 'lov',
                },
                key: 'department_id',
            }
        },
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'user_master',
                    schema: 'auth',
                },
                key: 'user_id',
            },
        },
        modifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        modifiedBy: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: {
                    tableName: 'user_master',
                    schema: 'auth',
                },
                key: 'user_id',
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    }, {
        schema: 'config',
        tableName: 'rows_arrangement',
        timestamps: false,
        comment: 'Admin will fill the data from the UI for this table which will store the row arrangement structure which will be used for visualisation and other purposes.',
        underscored: true,
        freezeTableName: true,
        hasTrigger: true,
    })
    return RowsArrangement;
}