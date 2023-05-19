var mongoose = require("../../infrastructure/db");
const { Schema } = require('mongoose');

let TypeSchema = new Schema({
    field: String,
    name: String,
})

let workingAddress = new Schema({
    address: {type: String, default: ""},
    district: {type: String, default: ""},
    ward: {type: String, default: ""},
    province: {type: String, default: ""},
    latitude: {type: Number, default: 0},
    longitude:{type: Number, default: 0},
    isHeadquarter: {type: Boolean, default: false}
})

let benefitSchema = new Schema({
    svg: String,
    desc: String,
    label: String,
})

let companyInfoSchema = new Schema( {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: [workingAddress],
    size: {
        label: {type:String, default:"50-100"},
        value: {type: Number, default: 4},
    },
    workingArea: [TypeSchema],
    benefits: [benefitSchema],
    desc: { type: String, default: "" },
    bannerImage: {type: String, default :""},
    aboutLink: {type: String, default:""},
    logo: { type: String, default: "" },
    video: { type: String, default: "" },
    imageIntro: [String],
})

var CompanySchema = new Schema({
    info: companyInfoSchema,
   
    blacklistCandidate: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isApproved: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }
)

companyInfoSchema.index({name: "text"})
companyInfoSchema.index({name: 1})

var Company = mongoose.model("Company", CompanySchema)
module.exports = Company;


