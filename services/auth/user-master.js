const db = require('../../utils/database/db-init').db;
const logger = require('../../utils/logger');
const { filterData } = require('../../utils/filter-data');
const getModel = require('../../utils/database/getModel');
const bcrypt = require('bcrypt');
const generateEmpCode = require("../../utils/get-e-code");
const setCurrentUserId = require("../../utils/database/db-config-variable");

const UserMasterService = {

    async getUserModel() {
        return await getModel(db, "auth", "user_master");
    },

    async createUser(userDetails){
        const t = await db.sequelize.transaction();
        try {
            const { success, message: UserMaster } = await this.getUserModel();
            if (!success) {
                await t.rollback();
                return { success: false, message: "User model not found" };
            }
            const password = userDetails.password;

            // Encrypt password for generating JWT Token
            userDetails.password = await bcrypt.hash(password, 10);
            userDetails.empCode = await generateEmpCode(userDetails.firstName);
            const createdUser = await UserMaster.create(userDetails, {
                transaction: t,
                returning: true,
                raw: true
            });
            const plainData = createdUser.get({ plain: true });
            const filteredData = filterData([plainData]);
            logger.info(`User created successfully with user Id: ${createdUser.userId}`);
            await t.commit();
            delete filteredData[0].password;
            return { success: true, message: filteredData[0] };

        } catch (e) {
            logger.error(`Error while creating user : `, e);
            await t.rollback();
            if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
                const errorMessages = e.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }));
                return {
                    success: false,
                    message: errorMessages[0].message
                };
            }
            return { success: false, message: e.message };
        }
    },

    async getUser(userId) {
        try {
            const { success, message: UserMaster } = await this.getUserModel();
            if (!success) {
                return { success: false, message: "User model not found" };
            }
            const user = await UserMaster.findByPk(userId);
            if (!user) {
                return { success: false, message: `User with user id, ${userId} not found` };
            }
            return { success: true, message: user };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    async getUserByEmail(email) {
        try {
            const { success, message: UserMaster } = await this.getUserModel();
            if (!success) {
                return { success: false, message: "User model not found" };
            }
            const user = await UserMaster.findOne({ where: { email: email }, raw: true });
            if (!user) {
                return { success: false, message: `User with email, ${email} not found` };
            }
            return { success: true, message: user };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    async modifyUser(userId, userDetails) {
        const t = await db.sequelize.transaction();
        try {
            const userData = await this.getUser(userId);
            if (!userData.success) {
                await t.rollback();
                return userData;
            }
            const { success, message: UserMaster } = await this.getUserModel();
            if (!success) {
                await t.rollback();
                return { success: false, message: "User model not found" };
            }
            // Encrypt password for generating JWT Token
            userDetails.password = await bcrypt.hash(userDetails.password, 10);
            userDetails.modifiedOn = new Date();
            userDetails.modifiedBy = userId;
            await setCurrentUserId(db.sequelize, userId, t);
            const updatedUser = await UserMaster.update(userDetails, {
                where: { userId: userId },
                transaction: t,
                returning: true,
            });
            logger.info(`User updated successfully with user Id: ${userId}`);
            const filteredData = filterData([updatedUser[1][0].dataValues]);
            await t.commit();
            delete filteredData[0].password;
            return { success: true, message: filteredData[0] };
        } catch (e) {
            logger.error(`Error while updating user : `, e);
            await t.rollback();
            return { success: false, message: e.message };
        }
    }
};

module.exports = UserMasterService;