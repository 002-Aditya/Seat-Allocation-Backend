const db = require('../../utils/database/db-init');
const logger = require('../../utils/logger');
const getModel = require('../../utils/database/getModel');

const DepartmentsService = {

    async getDepartmentModel(){
        return await getModel(db, "lov", "departments");
    },

    async getAllDepartments(){
        try {
            const { success, message: Departments } = await this.getDepartmentModel();
            if (!success) {
                return { success: false, message: "Departments model not found" };
            }
            const findAllDepartments = await Departments.findAll({ raw: true });
            if (!findAllDepartments) {
                return { success: false, message: "No departments found" };
            }
            return { success: true, message: findAllDepartments };
        } catch (e) {
            logger.error("Error occurred while fetching all departments", e);
            return { success: false, message: e.message };
        }
    },

    async getDepartmentById(departmentId){
        try {
            const { success, message: Departments } = await this.getDepartmentModel();
            if (!success) {
                return { success: false, message: "Departments model not found" };
            }
            const findDepartmentById = await Departments.findByPk(departmentId, { raw: true });
            if (!findDepartmentById) {
                return { success: false, message: "Department not found" };
            }
            return { success: true, message: findDepartmentById };
        } catch (e) {
            logger.error(`Error occurred while fetching department by id ${departmentId}`, e);
            return { success: false, message: e.message };
        }
    }

}

module.exports = DepartmentsService;