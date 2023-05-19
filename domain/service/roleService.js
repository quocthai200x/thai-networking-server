// const Company = require("../model/companies");
var Role = require("../model/roles")
var User = require("../model/users")
var roleDictionary = require("../../config/dictionary/role")

const roleService = {
    findAllAndOnlyNameOfCompany: async (companyId) => {
        const rolesFound = await Role.find({ companyId }).select({name: 1});
        if (rolesFound) {
            return rolesFound
        } else {
            throw new Error("Not found")
        }
    },
    findAllInCompany: async (companyId) => {
        // console.log(companyId)
        const rolesFound = await Role.find({ companyId });
        const promises = rolesFound.map(role => User.find({ roleNumber: roleDictionary.employee, roleId: role._id }).select({'info.name': 1}));
        const users = await Promise.all(promises);
        // const roleIds = rolesFound.map(role => role._id);
        // const users = await User.find({ roleNumber: roleDictionary.employee, roleId: { $in: roleIds } });
        if (rolesFound) {
            return { rolesFound, users };
        } else {
            throw new Error("Not found")
        }
    },
    create: async (name, companyId, settings) => {
        const roleFound = await Role.findOne({
            name,
            companyId,

        })
        if (roleFound || !name) {
            throw new Error("Role founded or name error")
        }
        const newRole = new Role({
            name,
            companyId,
            settings
        })
        let createdRole = await newRole.save();
        if (createdRole) {
            return createdRole
        }
        else {
            throw new Error("Cant create role")
        }
    },
    updateRole: async (roleSetting, roleName, companyId, newName) => {

        const [roleFound, roleNewnameFound] = await Promise.all([
            Role.findOne({ companyId, name: roleName }),
            Role.findOne({ companyId, name: newName })
        ])
        if (roleFound) {
            if (roleNewnameFound && roleName != newName) {
                throw new Error("Không thể đổi tên vai trò trùng")
            } else {
                if ((roleName != newName) && newName) {
                    roleFound.name = newName
                } else {
                    roleFound.name = roleName
                }
                roleFound.settings = roleSetting;
            }
            // check role dung la cong ty tao ra 
            const result = await roleFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Fail")
            }
        }
        else {
            throw new Error("Not found")
        }


    },
    attachRole: async (roleName, targetEmail, companyId) => {
        const [roleFound, userFound] = await Promise.all([
            Role.findOne({ name: roleName, companyId }),
            User.findOne({ email: targetEmail, roleNumber: 2, companyId }),
        ])

        if (roleFound && userFound) {
            // check role dung la cong ty tao ra 
            // && user target thuoc cong ty 
            // && user la employee
            userFound.roleId = roleFound._id;
            const result = await userFound.save();
            if (result) {
                return {
                    roleInfo: roleFound
                };
            } else {
                throw new Error("Fail")
            }

        }
        else {
            throw new Error("Not found")
        }
    }
}
module.exports = roleService;