var Application = require("../model/applications")
var Job = require("../model/jobs")
var User = require("../model/users")
var Company = require('../model/companies')
var Role =require('../model/roles')


const ValidationService = {
    validApplication: async(id ) =>{
        const found = await Application.findById(id)
        if(found){
            return found
        }
        return false;
    },
    validJob: async(id ) =>{
        const found = await Job.findById(id)
        if(found){
            return found
        }
        return false;
    },
    validUser: async(id ) =>{
        const found = await User.findById(id)
        if(found){
            return found
        }
        return false;
    },
    validCompany: async(id ) =>{
        const found = await Company.findById(id)
        if(found){
            return found
        }
        return false;
    },
    validRole: async(id ) =>{
        const found = await Role.findById(id)
        if(found){
            return found
        }
        return false;
    },
}


module.exports = ValidationService;