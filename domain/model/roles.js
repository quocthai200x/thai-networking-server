var mongoose = require("../../infrastructure/db");
const {Schema} = require('mongoose');


var RoleSchema = new Schema({
    name: String,
    companyId: {type:  Schema.Types.ObjectId, ref: 'Company'},
    settings:{
        recruitmentFunction:{
            canRead: {type: Boolean, default: false},
            canWrite: {type: Boolean, default: false},
        },
        applierFunction:{
            canRead: {type: Boolean, default: false},
            canWrite:{type: Boolean, default: false},
        },
        systemFunction:{
            canRead: {type: Boolean, default: false},
            canWriteRolePermission: {type: Boolean, default: false},
            canWriteCompanyInfo:{type: Boolean, default: false},
            canWriteUserPermission: {type: Boolean, default: false},
        },
        searchFunction:{
            canSearch: {type: Boolean, default: false},
        },
        statisticFunction: {
            canReadStatistic: {type :Boolean, default: false},
        },
        adminFunction : {
            isAdmin: {type: Boolean, default: false},
        } 
    }
   
}, { timestamps: true }
)


RoleSchema.index({companyId: 1, name: 1}, {unique: true})

var Role = mongoose.model("Role", RoleSchema)

module.exports = Role;


