var Application = require("../model/applications")
var Job = require("../model/jobs")
var User = require("../model/users")
var Company = require("../model/companies")

var roleDictionary = require("../../config/dictionary/role")
var applicationDictionary = require("../../config/dictionary/application")
const path = require("path")

function getApplicationBasedEndStatus({statusValue, from, to, companyId}){
    // console.log(from, to)
    return [
        {
            $match:{
                companyId: companyId,
            }
        },
        {
            $lookup: {
                from: "jobs", // Replace "jobs" with the actual name of the jobs collection
                localField: "jobId",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $lookup: {
                from: "users", // Replace "handlers" with the actual name of the handlers collection
                localField: "handleBy",
                foreignField: "_id",
                as: "handler"
            }
        },
        {
            $unwind: "$handler"
        },
        {
            $match: {
                "closeAt": {
                    $gte: from,
                    $lte: to
                },
                "status.value": statusValue
            }
        },
        {
            $group: {
                _id: {
                    jobId: "$job.info.name",
                    handleBy: "$handler.info.name"
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.jobId",
                value: {
                    $push: {
                        handleBy: "$_id.handleBy",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                jobName: "$_id",
                value: 1,
                _id: 0
            }
        }
    ] 
}

function getApplicationBasedNotEndStatus({statusValue, companyId}){
    return [
        {
            $match:{
                companyId: companyId,
            }
        },
        {
            $lookup: {
                from: "jobs", // Replace "jobs" with the actual name of the jobs collection
                localField: "jobId",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $lookup: {
                from: "users", // Replace "handlers" with the actual name of the handlers collection
                localField: "handleBy",
                foreignField: "_id",
                as: "handler"
            }
        },
        {
            $unwind: "$handler"
        },
        {
            $match: {
               
                "status.value": statusValue
            }
        },
        {
            $group: {
                _id: {
                    jobId: "$job.info.name",
                    handleBy: "$handler.info.name"
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.jobId",
                value: {
                    $push: {
                        handleBy: "$_id.handleBy",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                jobName: "$_id",
                value: 1,
                _id: 0
            }
        }
    ] 
}

const StatisticService = {

    getAll: async (from, to, companyId) => {
        let fromDate;
        let toDate;
        if(!from){
            fromDate = new Date('2000-01-01')
        }else{
            fromDate = new Date(from); // Replace with your 'from' date
        }
        if(!to){
            toDate = new Date("2100-01-01")
        }else{
            toDate = new Date(to);
        }
        const [
            applicationTurnIn, 
            applicationApprove, 
            applicationInterview, 
            applicationOffer, 
            applicationHired, 
            applicationNotQualify, 
            applicationDenied
        ] 
            = await Promise.all([
            Application.aggregate(getApplicationBasedNotEndStatus({
                statusValue: applicationDictionary.status.turnIn.value, companyId
            })),
            Application.aggregate(getApplicationBasedNotEndStatus({
                statusValue: applicationDictionary.status.approve.value, companyId
            })),
            Application.aggregate(getApplicationBasedNotEndStatus({
                statusValue: applicationDictionary.status.interview.value, companyId
            })),
            Application.aggregate(getApplicationBasedNotEndStatus({
                statusValue: applicationDictionary.status.offer.value,  companyId
            })),
            Application.aggregate(getApplicationBasedEndStatus({
                statusValue: applicationDictionary.status.getHired.value, from: fromDate, to: toDate, companyId
            })),
            Application.aggregate(getApplicationBasedEndStatus({
                statusValue: applicationDictionary.status.notQualify.value, from: fromDate, to: toDate, companyId
            })),
            Application.aggregate(getApplicationBasedEndStatus({
                statusValue: applicationDictionary.status.rejectByUser.value, from: fromDate, to: toDate, companyId
            })),
        ])
   
        return {
            applicationTurnIn, 
            applicationApprove, 
            applicationInterview, 
            applicationOffer, 
            applicationNotQualify, 
            applicationHired, 
            applicationDenied
        }
    }
}

module.exports = StatisticService;