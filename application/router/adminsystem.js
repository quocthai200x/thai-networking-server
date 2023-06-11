const express = require("express")
const router = express.Router()
const companyService = require("../../domain/service/companyService")
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")



router.put("/allow-business", auth.required, authorize.isAdminSystem, async (req, res) => {
    const { businessId } = req.query;
    try {
        const updateCompany = await companyService.allowBusiness(businessId);
        res.json(updateCompany)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})




module.exports = router;