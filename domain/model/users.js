var mongoose = require("../../infrastructure/db");
const {Schema} = require('mongoose');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



let ReviewSchema = new Schema({
    reviewerId: {type:  Schema.Types.ObjectId, ref: 'Company'},
    content: String,
    rate: Number,
})

let typeSchema = new Schema({
    field: String,
    name: String,
})

var UserSchema = new Schema({
    email: {type: String, index: true, require: true},
    hash: String,
    salt: String,
    roleNumber: Number,
    roleId: {type:  Schema.Types.ObjectId, ref: 'Role'},
    companyId: {type:  Schema.Types.ObjectId, ref: 'Company'},
    jobAttached: [ {type:  Schema.Types.ObjectId, ref: 'Job'}],
    
    activity :{
        searchHistory: [String] , // limit 10
        companyViewed: [ {type:  Schema.Types.ObjectId, ref: 'Company'}],
        companyFollowed: [ {type:  Schema.Types.ObjectId, ref: 'Company'}],
        jobViewed: [ {type:  Schema.Types.ObjectId, ref: 'Job'}],
        jobSaved: [ {type:  Schema.Types.ObjectId, ref: 'Job'}],
        jobApplied: [ {type:  Schema.Types.ObjectId, ref: 'Job'}],
        notification: [
            {
                eventName: String,
                timestamp: Date,
                content: String,
            }
        ],
    },
   
	info: {
        name: {type: String, require: true},
        phone: {type: String, require: true},
        allowSearchInfo: {type: Boolean, default: false},
        positionPresent:{type: String, default: ""},
        levelPresent:{type: String, default: ""},
        typeWorking: [typeSchema],
        yearExperienced: {type: Number, default: 0},
        workingLocationTarget: [String],
        educationLevel: String,
        salaryTarget: {type: Number, default: 0},
        address: {type: String, default: ""},
        country: {type: String, default: ""},
        ward: {type: String, default: ""},
        district: {type: String, default: ""},
        city: {type: String, default: ""},
        CV: {type: String, default: ""},
        skills: [String],
        avatar: {type: String, default: ""},
        dob: {type: Date, default: new Date().toISOString()},
        desc: {type: String, default: ""},
        experiences: [
            {
                position: String,
                company: String,
                from: Date,
                to: Date,
                isWorking: Boolean,
                desc: String,
            }
        ],
        education: [
            {
                major: String,
                college: String,
                certificate: String,
                from: Date,
                to: Date,
                desc: String,
            }
        ],
        foreignLanguage: [
            {
                name: String,
                level: String,
                certificate: String
            }
        ]
    },
    isForgotPassword: {type: Boolean, default: false}

}, { timestamps: true }
)

UserSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password,this.salt,10000,512,"sha512").toString("hex")
    return this.hash === hash;
}

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex")
    this.hash = crypto.pbkdf2Sync(password,this.salt,10000,512,"sha512").toString("hex") 
}
UserSchema.methods.generateJWT = function(req){
    const now = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(now.getDate()+ 10)
    let jwtGenerate =  jwt.sign({
        email:this.email,
        role: this.roleNumber,
        exp : parseInt(expirationDate.getTime()/1000,10)
    },process.env.JWT_SECRET)
    // req.session.userToken = jwtGenerate;
    return jwtGenerate;
}

UserSchema.index({roleNumber: 1})
UserSchema.index({"info.name": "text", "info.positionPresent": "text", "info.skills": "text"}, {partialFilterExpression: {"roleNumber" : 0}})
// UserSchema.index({}, {partialFilterExpression: {"roleNumber" : 0}})
// UserSchema.index({}, {partialFilterExpression: {"roleNumber" : 0}})
UserSchema.index({allowSearchInfo: 1},{partialFilterExpression: {"roleNumber" : 0}})
UserSchema.index({"info.typeWorking.name": 1},{partialFilterExpression: {"roleNumber" : 0}})
UserSchema.index({"info.yearExperienced": 1},{partialFilterExpression: {"roleNumber" : 0}})
UserSchema.index({"info.salaryTarget": 1},{partialFilterExpression: {"roleNumber" : 0}})
UserSchema.index({updatedAt: 1},{partialFilterExpression: {"roleNumber" : 0}})

var User = mongoose.model("User", UserSchema)

module.exports = User