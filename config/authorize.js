const Users = require("../domain/model/users")
const roleDictionary = require("./dictionary/role")
const Roles = require("../domain/model/roles");
const Role = require("../domain/model/roles");


const authorize = {
    isAdminSystem: async(req, res, next)=>{
        const { email, role } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdminSystem(userFound.roleNumber)) {
            next();
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    isCompany: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber) || roleDictionary.isEmployee(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    isAdmin: async (req, res, next) => {
        const { email, role } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canReadSystemSettings: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
        
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.systemFunction.canRead) {
                req.companyId = userFound.companyId
                next();
            }
            else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canWriteRecruitment: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.recruitmentFunction.canWrite) {
                req.companyId = userFound.companyId
                next();
            }
            else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },



    canWriteRolePermission: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.systemFunction.canWriteRolePermission) {
                req.companyId = userFound.companyId
                next();
            }
            else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },

    canWriteUserPermission: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }

        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.systemFunction.canWriteUserPermission) {
                req.companyId = userFound.companyId
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canWriteCompanyInfo: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);

            if (roleFound.settings.systemFunction.canWriteCompanyInfo) {
                req.companyId = userFound.companyId
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    isUserOrCanReadApplier: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.id = userFound.companyId;
            next();
        }
        else if (roleDictionary.isUser(userFound.roleNumber)) {
            req.id = userFound._id;
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.applierFunction.canRead) {
                req.id = userFound.companyId
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canReadApplier: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId;
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.applierFunction.canRead) {
                req.companyId = userFound.companyId
                req.employeeId = userFound._id
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canWriteApplier: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            req.employeeHandleId = userFound._id
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.applierFunction.canWrite) {
                req.companyId = userFound.companyId;
                req.employeeHandleId = userFound._id
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canSearchCandidate: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.searchFunction.canSearch) {
                req.companyId = userFound.companyId
                next();
            } else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }

        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    canReadStatistic: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isAdmin(userFound.roleNumber)) {
            req.companyId = userFound.companyId
        
            next();
        }
        else if (roleDictionary.isEmployee(userFound.roleNumber)) {
            const roleFound = await Role.findById(userFound.roleId);
            if (roleFound.settings.statisticFunction.canReadStatistic) {
                req.companyId = userFound.companyId
                next();
            }
            else {
                res.status(403);
                res.json({
                    message: "Forbidden"
                })
            }
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },
    isUser: async (req, res, next) => {
        const { email } = req.payload;
        const userFound = await Users.findOne({ email });
        if (!userFound) {
            res.status(400);
            res.json({
                message: "Not found user"
            })
        }
        if (roleDictionary.isUser(userFound.roleNumber)) {
            req.userId = userFound._id
            next();
        }
        else {
            res.status(403)
            res.json({
                message: "Forbidden"
            })
        }
    },

}


module.exports = authorize