exports.getDropDown = async (req, res, next) => {
    try {
        const { db } = await require("../utils/database/db-init");
        const input = req.body;
        const inputParams = JSON.stringify(input);
        const query = "SELECT lov.get_lov(:inputParams)";
        const result = await db.sequelize.query(query, {
            replacements: { inputParams: inputParams }
        });
        let firstInvGetLov = result[0][0].get_lov;
        return res.status(200).json(firstInvGetLov);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dropdown",
        });
    }
};