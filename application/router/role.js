const express = require("express")
const router = express.Router()
const roleService = require("../../domain/service/roleService")
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")

router.get("/only-name", auth.required, authorize.canReadSystemSettings, async (req,res)=>{
    const {companyId} = req;
    
    try {
        const listRole = await roleService.findAllAndOnlyNameOfCompany(companyId);
        res.json(listRole)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})
router.get("/", auth.required, authorize.canReadSystemSettings, async (req,res)=>{
    const {companyId} = req;
    
    try {
        const listRole = await roleService.findAllInCompany(companyId);
        res.json(listRole)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.post("/", auth.required, authorize.canWriteRolePermission, async (req, res) => {
    const { name, settings } = req.body;
    // console.log(name, req.companyId);
    try {
        const createdRole = await roleService.create(name, req.companyId, settings);
        res.json(createdRole)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})

router.put('/', auth.required, authorize.canWriteRolePermission, async (req, res)=>{
    const {roleSetting, roleName, newName} = req.body;
    const {companyId} = req;

    try {
        const updateRole = await roleService.updateRole(roleSetting, roleName, companyId, newName)
        res.json(updateRole)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})






module.exports = router;