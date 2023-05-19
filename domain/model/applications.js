var mongoose = require("../../infrastructure/db");
const { Schema } = require('mongoose');
var applicationDictionary = require("../../config/dictionary/application")
let NameValueSchema = new Schema({
    name: String,
    value: Number,
    note: {
        name: {type: String},
        value : Number
    }
})

let ReviewSchema = new Schema({
    content: String,
    rate: Number,
    
}, { timestamps: true })

let ApplicationSchema = new Schema({
    jobId:{ type: Schema.Types.ObjectId, ref: 'Job' },
    companyId:{ type: Schema.Types.ObjectId, ref: 'Company' },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {type: NameValueSchema, default: applicationDictionary.status.turnIn },
    createdBy: Number,
    handleBy: { type: Schema.Types.ObjectId, ref: 'User' },
    firstHanddle: String, 
    companyComment: ReviewSchema,
    candidateComment: ReviewSchema,
    closeAt: {type: Date}

}, { timestamps: true })

ApplicationSchema.index({candidateId: 1})
ApplicationSchema.index({companyId: 1})
ApplicationSchema.index({handleBy: 1})
ApplicationSchema.index({jobId: 1, candidateId: -1})
ApplicationSchema.index({_id: 1, companyId: 1})

var Application= mongoose.model("Application", ApplicationSchema)
module.exports = Application;