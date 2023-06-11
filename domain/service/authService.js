var nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
var generator = require('generate-password');
const Company = require("../model/companies");
const RoleDictionary = require("../../config/dictionary/role")
var User = require("../model/users")
var Role = require("../model/roles")
var Mail = require("./mailService")


const authService = {
    checkMailExisted: async (email) => {
        const userFound = await User.findOne({ email })
        if (userFound) {
            return {
                data: {
                    status: 1,
                    roleNumber: userFound.roleNumber
                },
                message: "Found",
            };
        } else {
            return {
                data: {
                    status: 0,
                },
                message: "Not found"
            }
        }
    },
    signUpAdminSystem: async (email, password) => {

        let result = await User.findOne({ email });
        if (!result) {
            const newUser = new User({
                email: email,
                roleNumber: RoleDictionary.adminSystem
            });
            newUser.setPassword(password)
            result = await newUser.save();
            // console.log(result);
            return newUser;
        } else {
            throw new Error("error/email_existed or company not found")
        }
    },
    signUpAdmin: async (email, password, companyData) => {
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                throw new Error("User found")
            }
            if (companyData.name) {
                const checkCompany = await Company.findOne({ "info.name": companyData.name })
                if (checkCompany) {
                    throw new Error("Company found")
                }
            }

            const newCompany = new Company({ info: companyData });
            let result = await newCompany.save();
            if (result) {
                const newUser = new User({
                    email: email,
                    roleNumber: RoleDictionary.admin,
                    companyId: result._id,
                });
                newUser.info.name = companyData.name;
                newUser.info.phone = companyData.phone;
                newUser.setPassword(password)
                result = await newUser.save();
                if (result) {
                    return newUser;
                } else {
                    throw new Error("cant create employee")
                }
            } else {
                throw new Error("Cant create company")
            }

        } catch (err) {
            throw new Error(err)
        }
    },


    addEmployee: async (email, companyId, roleName, name) => {

        const [checkUser, checkRole] = await Promise.all([
            User.findOne({ email }),
            Role.findOne({ name: roleName, companyId })
        ])
        if (checkUser) {
            throw new Error("User found")
        }
        if (!checkRole) {
            throw new Error("Role not found")
        }
        const newUser = new User({
            email: email,
            roleNumber: RoleDictionary.employee,
            companyId,
            roleId: checkRole._id,
        });
        let password = generator.generate({
            length: 10,
            numbers: true
        });
        newUser.setPassword(password)
        newUser.info.name = name
        try {

            const [result, sendMail] = await Promise.all([
                newUser.save(),
                Mail.sendMail(email, password),
            ])

            if (result && sendMail) {
                let newUser2 = {
                    _id: newUser._id,
                    email: newUser.email,
                    info: {
                        name: newUser.info.name
                    },
                    roleId: {
                        name: checkRole.name,
                        _id: checkRole._id,
                    },
                    updatedAt: newUser.updatedAt,
                }
                return newUser2;
            }
            else {
                throw new Error("cant create employee")
            }
        } catch (error) {
            await User.findOneAndDelete({ email })
            throw new Error("cant create employee")
        }


    },


    signUpUser: async (email, password, name, phone) => {
        let result = await User.findOne({ "email": email });
        if (!result) {
            const newUser = new User({
                email: email,
                roleNumber: RoleDictionary.user
            });
            newUser.info.name = name;
            newUser.info.phone = phone;
            newUser.setPassword(password)
            result = await newUser.save();
            // console.log(result);
            return newUser;
        } else {
            throw new Error("error/email_existed or company not found")
        }
    },
    login: async (email, password) => {
        let result = await User.findOne({ email: email, password: password });
        if (result) {
            return result;
        } else {
            throw new Error("User not found")
        }
    },
    changePass: async (email, oldPass, newPass) => {
        const userFound = await User.findOne({ email });
        if (userFound.validPassword(oldPass)) {
            userFound.setPassword(newPass)
            const result = await userFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Change password failed")
            }
        } else {
            throw new Error("Invalid password")
        }
    },
    forgotPassword: async (email) => {
        const userFound = await User.findOne({ email });
        if (userFound) {
            let password = generator.generate({
                length: 10,
                numbers: true
            });
            userFound.setPassword(password)
            result = await userFound.save();
            if (result) {
                const sendMail = await Mail.sendMail(email, password);
                if (sendMail) {
                    return result;
                }
                else {

                    throw new Error("Cant send mail")
                }
            } else {
                throw new Error("cant reset password")
            }
        } else {
            throw new Error("cant find user")
        }


    }
}

module.exports = authService;