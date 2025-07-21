const { Sequelize } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Departments = sequelize.define('departments', {
        departmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        departmentName: {
            type: DataTypes.STRING(50),
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Department name cannot be empty"
                }
            },
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    }, {
        schema: 'lov',
        tableName: 'departments',
        timestamps: false,
        underscored: true,
        comment: 'This table will be used to store the departments information that are there in an office.',
        freezeTableName: true,
        hasTrigger: true,
    })
    return Departments;
}