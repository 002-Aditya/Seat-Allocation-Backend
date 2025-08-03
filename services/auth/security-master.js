const db = require('../../utils/database/db-init').db;
const logger = require('../../utils/logger');
const getModel = require('../../utils/database/getModel');
const getIp = require("../../utils/security-information/getIp");
const geoLocation = require("../../utils/security-information/geoLocation");
const deviceInformation = require("../../utils/security-information/getDeviceInfo");

const SecurityMasterService = {

    async getGeoLocationModel(){
        return await getModel(db, "auth", "user_geolocation");
    },

    async getDeviceModel(){
        return await getModel(db, "auth", "device_details");
    },

    async getLoginDetailsModel(){
        return await getModel(db, "auth", "login_details");
    },

    async saveLoginDetails(req, userId){
        const t = await db.sequelize.transaction();
        try {
            const ip = getIp(req);
            const { success, message: LoginDetails } = await this.getLoginDetailsModel();
            if (!success) {
                await t.rollback();
                return { success: false, message: LoginDetails };
            }
            const savedGeolocationData = await this.saveGeoLocationDetails(ip, userId, t);
            if (!savedGeolocationData.success) {
                return savedGeolocationData;
            }
            const savedDeviceData = await this.saveDeviceDetails(req, userId, t);
            if (!savedDeviceData.success) {
                return savedDeviceData;
            }
            const userLoginData = {
                userId: userId,
                ipAddress: ip,
                locationId: savedGeolocationData.message.geoLocationId,
                deviceDetailsId: savedDeviceData.message.deviceDetailsId,
            };
            const savedLoginDetails = await LoginDetails.create(userLoginData, {
                transaction: t,
                raw: true,
            });
            savedLoginDetails.get({ plain: true });
            await t.commit();
            return { success: true, message: savedLoginDetails };
        } catch (e) {
            await t.rollback();
            logger.error(`Error occurred while saving login details of the user: `, e);
            return { success: false, message: e.message };
        }
    },

    async saveGeoLocationDetails(ip, userId, transaction) {
        try {
            const { success, message: GeoLocationDetails } = await this.getGeoLocationModel();
            if (!success) {
                await transaction.rollback();
                return { success: false, message: GeoLocationDetails };
            }
            const geoLocationData = await geoLocation(ip);

            // Mutate the lat/lng field to match PostGIS format
            geoLocationData.latitudeLongitude = {
                type: 'Point',
                coordinates: [
                    geoLocationData.ll?.[1] || 0,
                    geoLocationData.ll?.[0] || 0
                ]
            };
            geoLocationData.userId = userId;
            delete geoLocationData.ll;
            const insertedGeoLocationDetails = await GeoLocationDetails.create(geoLocationData, {
                transaction,
                raw: true,
            });
            return { success: true, message: insertedGeoLocationDetails.get({ plain: true }) };
        } catch (e) {
            await transaction.rollback();
            logger.error(`Error occurred while saving geo location details of the user: `, e);
            return { success: false, message: e.message };
        }
    },

    async saveDeviceDetails(req, userId, transaction){
        try {
            const { success, message: DeviceDetails } = await this.getDeviceModel();
            if (!success) {
                await transaction.rollback();
                return { success: false, message: DeviceDetails };
            }
            const deviceDetails = await deviceInformation(req);
            deviceDetails.userId = userId;
            const addedData = await DeviceDetails.create(deviceDetails, {
                transaction: transaction,
                raw: true,
            });
            addedData.get({ plain: true });
            return { success: true, message: addedData };
        } catch (e) {
            await transaction.rollback();
            logger.error(`Error occurred while saving device details of the user: `, e);
            return { success: false, message: e.message };
        }
    },

}

module.exports = SecurityMasterService;