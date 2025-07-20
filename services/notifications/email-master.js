const db = require('../../utils/database/db-init').db;
const logger = require('../../utils/logger');
const getModel = require('../../utils/database/getModel');

const EmailMasterService = {

    async getEmailMaster(){
        return await getModel(db, "notifications", "email_master");
    },

    async saveEmailMaster(emailDetails){
        const t = await db.sequelize.transaction();
        try {
            const { success, message: EmailMaster } = await this.getEmailMaster();
            if (!success) {
                logger.error("Email Master model not initialized");
                return { success: false, message: EmailMaster };
            }
            const savedEmailInfo = await EmailMaster.create(emailDetails, {
                transaction: t,
                raw: true,
            });
            logger.info("Email information has been saved successfully : ", savedEmailInfo.dataValues);
            await t.commit();
            return { success: true, message: savedEmailInfo.dataValues };
        } catch (e) {
            logger.error(`Error occurred while saving email information: `, e);
            await t.rollback();
            return { success: false, message: e };
        }
    }
}

module.exports = EmailMasterService;