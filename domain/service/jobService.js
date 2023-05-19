var Job = require("../model/jobs")
var jobDictionary = require("../../config/dictionary/job")
const Company = require("../model/companies")
const User = require("../model/users")

const jobService = {
    getListJobsName: async(companyId)=>{
        try {
            const jobsFound = await Job.find({companyId}).select({"info.name": 1, "info.recruitmentProcess": 1}).sort("info.name")
            if(jobsFound){
                return jobsFound;
            }else{
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
            
        }
    }, 
    findByStatus: async (companyId, status) => {
        try {
            if (status == "show") {
                const jobFound = await Job.find({ companyId, "status.value": jobDictionary.status.show.value })
                    .sort({ createdAt: -1 })
                if (jobFound) {
                    return jobFound
                } else {
                    throw new Error("Not found")
                }
            } else if (status == "hidden") {
                const jobFound = await Job.find({ companyId, "status.value": jobDictionary.status.hidden.value })
                    .sort({ createdAt: -1 })
                if (jobFound) {
                    return jobFound
                } else {
                    throw new Error("Not found")
                }
            }
            else if (status == "draft") {
                const jobFound = await Job.find({ companyId, "status.value": jobDictionary.status.draft.value })
                    .sort({ createdAt: -1 })
                if (jobFound) {
                    return jobFound
                } else {
                    throw new Error("Not found")
                }

            } else if (status == 'expire') {
                const currentDate = new Date();
                const expirationThreshold = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                const jobFound = await Job.find({ companyId,"info.outdate": { $gte: currentDate, $lt: expirationThreshold } })
                    .sort({ createdAt: -1 })
                if (jobFound) {
                    return jobFound
                } else {
                    throw new Error("Not found")
                }
            } else {
                throw new Error(`Status not allowed:${status} `)
            }

        } catch (error) {
            throw new Error(error)
        }
    },
    getCountOfStatus: async (companyId) => {
        try {
            const currentDate = new Date();
            const expirationThreshold = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            // console.log(expirationThreshold)
            const [show, draft, hidden, expiredIn7days] = await Promise.all([
                Job.countDocuments({ companyId, "status.value": jobDictionary.status.show.value }),
                Job.countDocuments({ companyId, "status.value": jobDictionary.status.draft.value }),
                Job.countDocuments({ companyId, "status.value": jobDictionary.status.hidden.value }),
                Job.countDocuments({ companyId, "info.outdate": { $gte: currentDate, $lt: expirationThreshold } }),
            ]);

            // const check = await Job.find({ companyId, "info.outdate": { $gte: currentDate, $lt: expirationThreshold } }).select("info.outdate");

            return {
                show, draft, hidden, expiredIn7days
            };
        } catch (error) {
            throw new Error(error)
        }

    },
    getUserFavoriteJob: async (email) => {
        let userFound = await User.findOne({ email })
            .populate({
                path: "activity.jobSaved",
                select: { "info.name": 1, "info.salaryRate": 1, "info.workingAddress": 1, "info.recruitmentProcess": 1, "info.outdate": 1, "companyId": 1 },
                populate: {
                    path: "companyId", select: { "info.logo": 1, "info.name": 1, }
                }
            })

        if (userFound) {
            // console.log(userFound)
            return userFound.activity.jobSaved.reverse();
        } else {
            throw new Error("User not existed")
        }

    },
    getJobByCompanyName: async (companyName) => {
        let companyFound = await Company.findOne({ "info.name": companyName })
        if (companyFound) {
            let companyId = companyFound._id
            const jobFound = await Job.find({ companyId, "status.value": jobDictionary.status.show.value })
                .select({ status: 0 })
            if (jobFound) {
                return jobFound
            } else {
                throw new Error("Not existed")
            }
        } else {
            throw new Error("Company not existed")
        }
    },
    countInField: async (field) => {
        // console.log(field);
        let result = await Job.countDocuments({ "info.type.field": field, "info.outdate": { $gt: new Date() }, 'status.value': 0, })
        if (result) {
            return result
        } else {
            throw new Error("cant count")
        }
    },
    // search: async (key) => {
    //     console.log(key)
    //     key = key.split(" ");
    //     console.log(key);
    //     const searchFound = await Job.find(
    //         {
    //             "info.name":{
    //                 "$in": {
    //                     $regex: key,
    //                     $option: 1
    //                 }
    //             }
    //         }
    //     )
    // if(searchFound) {
    //     return searchFound
    // }else{
    //     throw new Error("No items found")
    // }
    // },
    getJobByName: async (jobName, companyId) => {
        // console.log(jobName, companyId)
        const jobFound = await Job.findOne({ "info.name": jobName, companyId, "status.name": jobDictionary.status.show.name })
            .select({ status: 0 })
            .populate({ path: "companyId", select: { "info": 1 } })
        if (jobFound) {
            return jobFound
        } else {
            throw new Error("Not existed")
        }
    },
    getOtherJobsByCompany: async (jobName, companyId) => {
        // console.log(jobName, companyId)
        const jobFound = await Job.find({ companyId, "status.value": jobDictionary.status.show.value, "info.outdate": { $gt: new Date() } })
            .select({ status: 0 })
        if (jobFound) {
            return jobFound.filter((value) => (value.info.name != jobName))
        } else {
            throw new Error("Not existed")
        }
    },
    create: async (companyId, jobInfo) => {
        // console.log(jobInfo)
        const jobFound = await Job.findOne({ companyId, "info.name": jobInfo.name })
        if (jobFound) {
            throw new Error("Job in company existed");
        } else {
            const job = new Job({
                companyId,
                info: jobInfo
            })
            const createdJob = await job.save();
            if (createdJob) {
                return createdJob;
            } else {
                throw new Error("Cant create job")
            }
        }
    },
    update: async (companyId, jobName, jobInfo) => {
        const jobFound = await Job.findOne({ "info.name": jobName, companyId });
        if (jobFound) {
            jobInfo.recruitmentProcess = jobFound.info.recruitmentProcess;
            jobFound.info = jobInfo;
            const updateJob = await jobFound.save();
            if (updateJob) {
                return updateJob;
            } else {
                throw new Error("Cant update job")
            }
        } else {
            throw new Error("Job not existed");

        }
    },
    updateStatus: async (companyId, jobName, status) => {
        const jobFound = await Job.findOne({ "info.name": jobName, companyId });
        if (jobFound) {
            jobFound.status = status;
            const updateJob = await jobFound.save();
            if (updateJob) {
                return status;
            } else {
                throw new Error("Cant update job")
            }
        } else {
            throw new Error("Job not existed");

        }
    },
    updateView: async (jobName, companyId) => {
        // console.log(jobName, companyId)
        const jobFound = await Job.findOne({ "info.name": jobName, companyId, "status.name": jobDictionary.status.show.name })
        if (jobFound) {
            jobFound.viewed = jobFound.viewed + 1;
            const update = await jobFound.save();
            if (update) {
                return update
            } else {
                throw new Error("Cant update job")

            }

        } else {
            throw new Error("Not existed")
        }
    },
    updateModel: async () => {
        let benefits = []
        for (let index = 0; index < 3; index++) {
            benefits.push({
                svg: "family_restroom",
                desc: "Lương thưởng tháng thứ 13 hấp dẫn người ứng viên nên là hãy ứng tuyển đi",
                label: "Gia đình",
            })
        }
        Job.updateMany({}, {
            $set: {
                status: {
                    name: "Đang hiển thị",
                    value: 0
                },
                // "info.benefits": benefits
            }
        }, function (err, affected) {
            if (err) {
                throw new Error("Some thing wrong")
            } else {
                console.log('Updated %d documents', affected);
                return affected
            }
        });

       
    }

}
// const jobService = {
//     getJob: () => {
//         return Job.find({});
//     },

//     saveJob: (email, content, imageUrl) => {
//         const job = new Job({
//             email,
//             content,
//             imageUrl
//         })
//         job.save();
//         return job;
//     },
//     like: async (jobId, email) => {
//         const job = await Job.findById(jobId).select("like");
//         // old doc without "like" field
//         if (!job.like) {
//             job.like = [];
//         }
//         if (job.like.find(item => item === email) != null) {
//             //user had liked && and now delete 
//             job.like = job.like.filter(item => item !== email)
//         } else {
//             // user not like && now like
//             job.like.push(email);

//         }
//         await job.save();
//         return job.toObject().like;
//     },
//     comment: async (jobId, email, content) => {
//         const result = await Job.update({ "_id": jobId }, {
//             $push: {
//                 comments: { email, content }
//             }
//         })

//     },
//     loadComment :async(jobId)=>{
//         const job = await job.findById(jobId).select("comments");
//         return job.toObject().comments;
//     }
// }
module.exports = jobService;