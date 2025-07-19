const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Bookings = sequelize.define('bookings', {
        bookingId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
        },
        seatNo: {
            type: DataTypes.INTEGER
        },
        rowId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'rows_arrangement',
                    schema: 'config',
                },
                key: 'row_id',
            },
        },
        bookedBy: {
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
        schema: 'allotment',
        tableName: 'bookings',
        timestamps: false,
        comment: 'This table will store the information of the seats that which of the seat is currently available or not.',
        underscored: true,
        freezeTableName: true
    })
    return Bookings;
}