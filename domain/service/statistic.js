var Application = require("../model/applications")
var Job = require("../model/jobs")
var User = require("../model/users")

var applicationDictionary = require("../../config/dictionary/application")
const { default: mongoose } = require("mongoose")



function getApplicationBasedEndStatus({ statusValue, from, to, companyId }) {
    // console.log(from, to)
    return [
        {
            $match: {
                companyId: mongoose.Types.ObjectId(companyId),

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

function getApplicationBasedNotEndStatus({ statusValue, companyId }) {
    return [
        {
            $match: {
                companyId: mongoose.Types.ObjectId(companyId),

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
    getListStatistic: async (from, to, employerEmail, jobName, companyId) =>{
        if ((typeof to !== 'string' || isNaN(new Date(to).getTime())) || (typeof from !== 'string' || isNaN(new Date(from).getTime()))) {
            to = "2100-01-01";
            from ="1970-01-01";
        }
        let employerId = "";
        let jobId= "";
        if(employerEmail){
            const userFound = await User.findOne({email: employerEmail, companyId, roleNumber: 2})
            if(userFound){
                employerId = userFound._id
            }
        }
        if(jobName){
            const jobFound = await Job.findOne({companyId, "info.name": jobName})
            if(jobFound){
                jobId = jobFound._id
            }
        }
        
        const applicationCountFound = await Application.aggregate([
            // Match documents by companyId a nd updatedAt range
            {
                $match: {
                  companyId: mongoose.Types.ObjectId(companyId),
                  updatedAt: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                  },
                  $expr: {
                    $and: [
                      {
                        $cond: {
                          if: { $ne: [employerId, ""] },
                          then: { $eq: ["$handleBy", employerId] },
                          else: true
                        }
                      },
                      {
                        $cond: {
                          if: { $ne: [jobId, ""] },
                          then: { $eq: ["$jobId", jobId] },
                          else: true
                        }
                      }
                    ]
                  }
                }
              },
            // Populate jobId from "jobs" collection
            {
              $lookup: {
                from: "jobs",
                localField: "jobId",
                foreignField: "_id",
                as: "jobInfo"
              }
            },
            // Unwind the "jobInfo" array
            {
              $unwind: "$jobInfo"
            },
            // Populate handleBy from "users" collection
            {
              $lookup: {
                from: "users",
                localField: "handleBy",
                foreignField: "_id",
                as: "handleByInfo"
              }
            },
            // Unwind the "handleByInfo" array
            {
              $unwind: "$handleByInfo"
            },
            // Group documents by jobId, handleBy, status.name, and status.value
            {
              $group: {
                _id: {
                  jobName: "$jobInfo.info.name",
                  handleByName: "$handleByInfo.info.name",
                  handlerEmail : "$handleByInfo.email",
                  statusName: "$status.name",
                  statusValue: "$status.value"
                },
                count: { $sum: 1 }
              }
            },
            // Add an additional "count" field to each element of the status array
            {
              $project: {
                _id: 0,
                jobName: "$_id.jobName",
                handleBy: "$_id.handleByName",
                handlerEmail: "$_id.handlerEmail",
                status: {
                  value: "$_id.statusValue",
                  name: "$_id.statusName",
                  count: "$count"
                }
              }
            },
            // Group by jobId and handleBy to get the final array
            {
              $group: {
                _id: {
                    jobName: "$jobName",
                  handleBy: "$handleBy",
                  handlerEmail: "$handlerEmail",
                },
                status: { $push: "$status" }
              }
            },
            {
                $addFields: {
                  statusArray: [
                    { value: applicationDictionary.status.turnIn.value, name: applicationDictionary.status.turnIn.name, count: 0 },
                    { value: applicationDictionary.status.approve.value, name: applicationDictionary.status.approve.name, count: 0 },
                    { value: applicationDictionary.status.interview.value, name: applicationDictionary.status.interview.name, count: 0 },
                    { value: applicationDictionary.status.offer.value, name: applicationDictionary.status.offer.name, count: 0 },
                    { value: applicationDictionary.status.getHired.value, name: applicationDictionary.status.getHired.name, count: 0 },
                    { value: applicationDictionary.status.notQualify.value, name: applicationDictionary.status.notQualify.name, count: 0 },
                    { value: applicationDictionary.status.rejectByUser.value, name: applicationDictionary.status.rejectByUser.name, count: 0 },
                    // Add other objects in the provided array here
                  ]
                }
              },
              // Compare and update the count field in statusArray
              {
                $project: {
                  _id: 0,
                  jobName: "$_id.jobName",
                  handleBy: "$_id.handleBy",
                  handlerEmail: "$_id.handlerEmail",
                  statusArray: {
                    $map: {
                      input: "$statusArray",
                      as: "statusArray",
                      in: {
                        $let: {
                          vars: {
                            obj2: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$status",
                                    cond: {
                                      $and: [
                                        { $eq: ["$$statusArray.value", "$$this.value"] },
                                        { $eq: ["$$statusArray.name", "$$this.name"] }
                                      ]
                                    }
                                  }
                                },
                                0
                              ]
                            }
                          },
                          in: {
                            value: "$$statusArray.value",
                            name: "$$statusArray.name",
                            count: { $ifNull: ["$$obj2.count", "$$statusArray.count"] }
                          }
                        }
                      }
                    }
                  },
                }
              },
            // Sort the final results if necessary
            {
              $sort: {
                "_id.jobName": 1,
                "_id.handlerEmail": 1,
                "_id.handleBy": 1,
              }
            }
          ])
          
        return {data: applicationCountFound, isQueryEmployer: employerEmail?true:false, isQueryJob: jobName?true:false};
    },
    getCandidateFunnel: async (from, to, employerEmail, jobName, companyId) => {
        if ((typeof to !== 'string' || isNaN(new Date(to).getTime())) || (typeof from !== 'string' || isNaN(new Date(from).getTime()))) {
            to = "2100-01-01";
            from ="1970-01-01";
        }
        let employerId = "";
        let jobId= "";
        if(employerEmail){
            const userFound = await User.findOne({email: employerEmail, companyId, roleNumber: 2})
            if(userFound){
                employerId = userFound._id
            }
        }
        console.log(employerId)
        if(jobName){
            const jobFound = await Job.findOne({companyId, "info.name": jobName})
            if(jobFound){
                jobId = jobFound._id
            }
        }

        let queryCondition = {
            companyId: mongoose.Types.ObjectId(companyId),
            ...(employerId && ({
                handleBy: employerId,

            })),
            ...(jobId && ({
                jobId: jobId,

            })),
            createdAt: {
                $gte: from,
                $lte: to
            }
        }


        const [countTurnIn, countApproved, countInterview, countOffered, countGetHired] = await Promise.all([
            Application.countDocuments({ ...queryCondition, }),
            Application.countDocuments({
                ...queryCondition, approvedAt: {
                    $gte: from,
                    $lte: to
                }
            }),
            Application.countDocuments({
                ...queryCondition, interviewedAt: {
                    $gte: from,
                    $lte: to
                }
            }),
            Application.countDocuments({
                ...queryCondition, offeredAt: {
                    $gte: from,
                    $lte: to
                }
            }),
            Application.countDocuments({
                ...queryCondition, closeAt: {
                    $gte: from,
                    $lte: to
                },
                "status.value": applicationDictionary.status.getHired.value
            })
        ])

        return { countTurnIn, countApproved, countInterview, countOffered, countGetHired}
    },
    getBasedEmployer: async (from, to, companyId, email) => {
        let fromDate;
        let toDate;
        if (!from) {
            fromDate = new Date('2000-01-01')
        } else {
            fromDate = new Date(from); // Replace with your 'from' date
        }
        if (!to) {
            toDate = new Date("2100-01-01")
        } else {
            toDate = new Date(to);
        }
        const employerFound = await User.findOne({ email, roleNumber: 2 })
        if (employerFound) {

            // const countTurnIn = await Application.find({
            //     // companyId,
            //     // handleBy: employerFound._id,
            //     'status.name': applicationDictionary.status.turnIn.name

            // }).populate([{path: "jobId", select : "info.name"}])
            // .sort("jobId")
            const countFound = await Application.aggregate([
                {
                    $match: {
                        companyId: mongoose.Types.ObjectId(companyId),

                        handleBy: employerFound._id, // Replace user._id with the ObjectID value
                        $or: [
                            { 'status.value': { $in: [4, 5, 6] }, closeAt: { $gte: fromDate, $lte: toDate } },
                            { 'status.value': { $in: [0, 1, 2, 3] } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "jobs",  // Replace "jobs" with the actual collection name for jobs
                        localField: "jobId",
                        foreignField: "_id",
                        as: "jobInfo"
                    }
                },
                {
                    $unwind: "$jobInfo"
                },
                {
                    $group: {
                        _id: {
                            jobName: "$jobInfo.info.name",
                            statusName: "$status.name",
                            statusValue: "$status.value"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.jobName",
                        newStatusCounts: {
                            $push: {
                                statusName: "$_id.statusName",
                                count: "$count",
                                statusValue: "$_id.statusValue",
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { jobName: "$_id", newStatusCounts: "$newStatusCounts" } },
                        summary: { $push: "$newStatusCounts" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        data: 1,
                        summary: {
                            $reduce: {
                                input: "$summary",
                                initialValue: [],
                                in: { $concatArrays: ["$$value", "$$this"] }
                            }
                        },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        data: 1,
                        final_summary: {
                            $reduce: {
                                input: "$summary",
                                initialValue: [],
                                in: {
                                    $cond: [
                                        {
                                            $in: ["$$this.statusName", "$$value.statusName"]
                                        },
                                        {
                                            $map: {
                                                input: "$$value",
                                                as: "item",
                                                in: {
                                                    $cond: [
                                                        { $eq: ["$$item.statusName", "$$this.statusName"] },
                                                        {
                                                            statusName: "$$item.statusName",
                                                            count: { $add: ["$$item.count", "$$this.count"] },
                                                            statusValue: "$$item.statusValue" // Include statusValue field
                                                        },
                                                        "$$item"
                                                    ]
                                                }
                                            }
                                        },
                                        { $concatArrays: ["$$value", ["$$this"]] }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        data: 1,
                        final_summary: 1,
                    }
                }

            ]);
            return countFound[0]
        } else {
            throw new Error("Không có nhân viên này")
        }
    },
    getAll: async (from, to, employerEmail, jobName, companyId)=> {
        if ((typeof to !== 'string' || isNaN(new Date(to).getTime())) || (typeof from !== 'string' || isNaN(new Date(from).getTime()))) {
            to = "2100-01-01";
            from ="1970-01-01";
        }
        let employerId = "";
        let jobId= "";
        if(employerEmail){
            const userFound = await User.findOne({email: employerEmail, companyId, roleNumber: 2})
            if(userFound){
                employerId = userFound._id
            }
        }
        if(jobName){
            const jobFound = await Job.findOne({companyId, "info.name": jobName})
            if(jobFound){
                jobId = jobFound._id
            }
        }
        let queryCondition = {
            companyId: mongoose.Types.ObjectId(companyId),
            ...(employerId && ({
                handleBy: employerId,

            })),
            ...(jobId && ({
                jobId: jobId,

            })),
            updatedAt: {
                $gte: from,
                $lte: to
            }
        }


        const [countTurnIn, countApproved, countInterview, countOffered, countGetHired, countNotQualify, countRejectByUser] = await Promise.all([
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.turnIn.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.approve.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.interview.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.offer.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.getHired.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.notQualify.value }),
            Application.countDocuments({ ...queryCondition,  "status.value": applicationDictionary.status.rejectByUser.value }),
        ])

        return { countTurnIn, countApproved, countInterview, countOffered, countGetHired, countNotQualify, countRejectByUser}
    }
}

module.exports = StatisticService;