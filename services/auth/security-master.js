const db = require('../../utils/database/db-init').db;
const logger = require('../../utils/logger');
const getModel = require('../../utils/database/getModel');
const getIp = require("../../utils/security-information/getIp");
const geoLocation = require("../../utils/security-information/geoLocation");
const deviceInformation = require("../../utils/security-information/getDeviceInfo");
const setCurrentUserId = require("../../utils/database/db-config-variable");

const SecurityMasterService = {

    async getGeoLocationModel() {
        return await getModel(db, "auth", "user_geolocation");
    },

    async getDeviceModel() {
        return await getModel(db, "auth", "device_details");
    },

    async getLoginDetailsModel() {
        return await getModel(db, "auth", "login_details");
    },

    async saveLoginDetails(req, userId) {
        const t = await db.sequelize.transaction();

        try {
            const ip = await getIp(req);
            const { success: loginSuccess, message: LoginDetails } = await this.getLoginDetailsModel();
            const { success: geoSuccess, message: GeoLocationDetails } = await this.getGeoLocationModel();
            const { success: deviceSuccess, message: DeviceDetails } = await this.getDeviceModel();

            if (!loginSuccess || !geoSuccess || !deviceSuccess) {
                await t.rollback();
                return { success: false, message: "Failed to fetch models." };
            }

            const verifyExistence = await this.findUserLoginDetailsByUserId(userId, LoginDetails);
            if (!verifyExistence.success) {
                await t.rollback();
                return { success: false, message: verifyExistence.message };
            }

            await setCurrentUserId(db.sequelize, userId, t);

            if (verifyExistence.message.length > 0) {
                return await this.updateLoginDetails(ip, userId, t, req, LoginDetails, GeoLocationDetails, DeviceDetails);
            }

            const savedGeolocationData = await this.saveGeoLocationDetails(ip, userId, t, GeoLocationDetails);
            if (!savedGeolocationData.success) return savedGeolocationData;

            const savedDeviceData = await this.saveDeviceDetails(req, userId, t, DeviceDetails);
            if (!savedDeviceData.success) return savedDeviceData;

            const userLoginData = {
                userId,
                ipAddress: ip,
                locationId: savedGeolocationData.message.geoLocationId,
                deviceDetailsId: savedDeviceData.message.deviceDetailsId,
                loginTime: new Date(),
            };

            const savedLoginDetails = await LoginDetails.create(userLoginData, {
                transaction: t,
                raw: true,
            });

            await t.commit();
            return { success: true, message: savedLoginDetails.get({ plain: true }) };

        } catch (e) {
            await t.rollback();
            logger.error(`Error occurred while saving login details: `, e);
            return { success: false, message: e.message };
        }
    },

    async saveGeoLocationDetails(ip, userId, transaction, GeoLocationDetails) {
        try {
            const geoLocationData = await geoLocation(ip);
            const latitude = geoLocationData.ll?.[0] || 0;
            const longitude = geoLocationData.ll?.[1] || 0;
            const cleanData = {
                country: geoLocationData.country,
                region: geoLocationData.region,
                city: geoLocationData.city,
                timezone: geoLocationData.timezone,
                latitudeLongitude: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                userId
            };
            const inserted = await GeoLocationDetails.create(cleanData, {
                transaction,
                raw: true
            });
            return {
                success: true,
                message: inserted.get({ plain: true })
            };
        } catch (e) {
            await transaction.rollback();
            logger.error("Error saving geo location:", e);
            return {
                success: false,
                message: e.message
            };
        }
    },

    async saveDeviceDetails(req, userId, transaction, DeviceDetails) {
        try {
            const deviceDetails = await deviceInformation(req);
            deviceDetails.userId = userId;

            const inserted = await DeviceDetails.create(deviceDetails, {
                transaction,
                raw: true,
            });

            return { success: true, message: inserted.get({ plain: true }) };
        } catch (e) {
            await transaction.rollback();
            logger.error(`Error saving device details: `, e);
            return { success: false, message: e.message };
        }
    },

    async updateLoginDetails(ip, userId, transaction, req, LoginDetails, GeoLocationDetails, DeviceDetails) {
        try {
            const updatedLocation = await this.updateGeoLocationDetails(ip, userId, transaction, GeoLocationDetails);
            if (!updatedLocation.success) return updatedLocation;

            const updatedDevice = await this.updateDeviceDetails(req, userId, transaction, DeviceDetails);
            if (!updatedDevice.success) return updatedDevice;

            const updateData = {
                ipAddress: ip,
                loginTime: new Date(),
                locationId: updatedLocation.message.geoLocationId,
                deviceDetailsId: updatedDevice.message.deviceDetailsId,
            };

            await LoginDetails.update(updateData, {
                where: { userId },
                transaction,
            });

            await transaction.commit();
            return { success: true, message: updateData };

        } catch (e) {
            await transaction.rollback();
            logger.error(`Error updating login details: `, e);
            return { success: false, message: e.message };
        }
    },

    async updateGeoLocationDetails(ip, userId, transaction, GeoLocationDetails) {
        try {
            const geoLocationData = await geoLocation(ip);
            geoLocationData.latitudeLongitude = {
                type: 'Point',
                coordinates: [
                    geoLocationData.ll?.[1] || 0,
                    geoLocationData.ll?.[0] || 0
                ]
            };
            geoLocationData.userId = userId;
            delete geoLocationData.ll;

            const [count, [updatedRecord]] = await GeoLocationDetails.update(geoLocationData, {
                where: { userId },
                transaction,
                returning: true,
            });

            return { success: true, message: updatedRecord.get({ plain: true }) };
        } catch (e) {
            logger.error(`Error updating geo location: `, e);
            return { success: false, message: e.message };
        }
    },

    async updateDeviceDetails(req, userId, transaction, DeviceDetails) {
        try {
            const deviceDetails = await deviceInformation(req);
            deviceDetails.userId = userId;

            const [count, [updatedRecord]] = await DeviceDetails.update(deviceDetails, {
                where: { userId },
                transaction,
                returning: true,
            });

            return { success: true, message: updatedRecord.get({ plain: true }) };
        } catch (e) {
            logger.error(`Error updating device details: `, e);
            return { success: false, message: e.message };
        }
    },

    async findUserLoginDetailsByUserId(userId, LoginDetails) {
        try {
            const records = await LoginDetails.findAll({
                where: { userId },
                raw: true,
            });
            return { success: true, message: records };
        } catch (e) {
            logger.error(`Error fetching login details for userId ${userId}: `, e);
            return { success: false, message: e.message };
        }
    },
};

module.exports = SecurityMasterService;