var Application = require("../model/applications")
var Job = require("../model/jobs")
var User = require("../model/users")
var Company = require("../model/companies")

var roleDictionary = require("../../config/dictionary/role")
var applicationDictionary = require("../../config/dictionary/application")
const path = require("path")
// var ValidationService = require('./validationService');
// const { validJob, validUser } = require("./validationService")


const ApplicationService = {
    getNotClose: async(companyId, employeeId) =>{
        let applicationFound;
        if(employeeId){
            applicationFound = await Application.find({companyId, closeAt: { $exists: false }, handleBy: employeeId })
            .populate({ path: "candidateId", select: { "info.name": 1 } })
            .populate({ path: "jobId", select: { "info.name": 1 } })
            .populate({ path: "handleBy", select: { "info.name": 1 } })
            .sort({updatedAt: 1})
        }else{
            applicationFound = await Application.find({companyId, closeAt: { $exists: false } })
            .populate({ path: "candidateId", select: { "info.name": 1 } })
            .populate({ path: "jobId", select: { "info.name": 1 } })
            .populate({ path: "handleBy", select: { "info.name": 1 } })
        }
  
       
        if (applicationFound) {
            return {
                total: applicationFound.length,
                data: applicationFound,
            }
        } else {
            throw new Error("Not found")
        }
    },
    findOneInCompany: async (applicationId, companyId) => {

        const applicationFound = await Application.findOne({ _id: applicationId, companyId })
            .populate({ path: "candidateId", select: { "info": 1 } })
            .populate({ path: "jobId", select: { "info": 1 } })
            .lean()
        // .populate({ path: "companyId", select: { "info.logo": 1, "info.name": 1 } })
        if (applicationFound) {
            const [countTurnIn, countApprove, countInterview, countOffer, countGetHired, countRejectByUser, countNotQualify] = await Promise.all([
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.turnIn.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.approve.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.interview.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.offer.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.getHired.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.rejectByUser.value }).lean(),
                Application.countDocuments({ jobId: applicationFound.jobId._id, "status.value": applicationDictionary.status.notQualify.value }).lean(),
            ]);
            return {
                data: applicationFound,
                countTurnIn, countApprove, countInterview, countOffer, countGetHired, countRejectByUser, countNotQualify
            }
        } else {
            throw new Error("Not found")
        }
    },
    findByJobName: async (jobName, companyId, employeeId) => {
        const jobFound = await Job.findOne({ companyId, "info.name": jobName }).select({ _id: 1 })
        // console.log(jobFound)
        console.log(jobFound)
        if (jobFound) {
            let applicationFound = await Application.find({ companyId, jobId: jobFound._id }).populate([{ path: "candidateId", select: "info" }, {path: "handleBy", select :"info.name"}])
            if (applicationFound) {
                if(employeeId){
                    // console.log(applicationFound[0].handleBy.equals(employeeId))
                    applicationFound = applicationFound.filter(item=> item.handleBy.equals(employeeId))
                    // console.log(applicationFound)
                }
                return applicationFound
            } else {
                throw new Error("Not found")
            }
            // return 1
        } else {
            throw new Error("Not found")
        }

    },
    getAllByUser: async (candidateId) => {
        const applicationFound = Application.find({ candidateId }).sort({ updatedAt: -1 })
            .populate({ path: "jobId", select: { "info.name": 1, "info.salaryRate": 1, "info.workingAddress": 1, "info.recruitmentProcess": 1 }, })
            .populate({ path: "companyId", select: { "info.logo": 1, "info.name": 1 } })
        if (applicationFound) {
            return applicationFound
        } else {
            throw new Error("Not found")
        }
    },

    getAllByCompany: async (companyId) => {
        const applicationFound = Application.find({ companyId }).sort('jobId').populate({ path: "candidateId", select: "info" })
        if (applicationFound) {
            return applicationFound
        } else {
            throw new Error("Not found")
        }
    },
    findWithCandidateAndJobID: async (candidateId, jobId) => {
        const applicationFound = Application.findOne({ candidateId, jobId })
        if (applicationFound) {
            return applicationFound
        } else {
            throw new Error("Not found")
        }
    },
    // getByJob: async(id)
    invite: async (jobName, candidateEmail, companyId) => {
        const JobFound = await Job.findOne({ companyId, "info.name": jobName });
        const UserFound = await User.findOne({ email: candidateEmail, roleNumber: 0 });
        const adminCompanyFound = await User.findOne({ companyId, roleNumber: 1 })
        // console.log(JobFound)
        if (UserFound && JobFound && JobFound.status.value == 0 && adminCompanyFound) {
            const candidateApplierFound = await Application.findOne({ jobId: JobFound._id, candidateId: UserFound._id })
            if (!candidateApplierFound) {
                const newApplication = new Application({
                    jobId: JobFound._id, candidateId: UserFound._id, companyId, handleBy: adminCompanyFound._id
                })
                newApplication.createdBy = applicationDictionary.byCompany;
                const result = await newApplication.save();
                if (result) {
                    return result
                } else {
                    throw new Error("Cant create application")
                }
            } else {
                throw new Error("Application existed")
            }

        } else {
            throw new Error("Job & User not existed")
        }
    },
    apply: async (userId, jobName, companyId, employeeHandle) => {
        const JobFound = await Job.findOne({ "info.name": jobName, companyId });
        if (JobFound) {
            const candidateApplierFound = await Application.findOne({ jobId: JobFound._id, candidateId: userId })
            let employeeHandleFound = await User.findOne({ email: employeeHandle, roleNumber: 2, companyId })
            let firstHanddle;
            // nếu không thấy tức cần nick admin ra tay
            // console.log(employeeHandleFound)
            if (!employeeHandleFound) {
                employeeHandleFound = await User.findOne({ companyId, roleNumber: 1 })
                const companyFound = await Company.findById(companyId)
                firstHanddle = companyFound.info.name
            } else {
                // tìm thấy gắn thẳng nhân viên


                firstHanddle = employeeHandleFound.info.name
            }
            if (!candidateApplierFound && employeeHandleFound) {
                const newApplication = new Application({
                    jobId: JobFound._id, candidateId: userId, companyId, handleBy: employeeHandleFound._id, firstHanddle
                })
                newApplication.createdBy = applicationDictionary.byUser;
                const result = await newApplication.save();
                if (result) {
                    return result
                } else {
                    throw new Error("Cant create application")
                }
            } else {
                throw new Error("Application existed")
            }
        } else {
            throw new Error("Job not existed")
        }
    },
    getAllByEmployee: async(employeeId) =>{
        const applicationsFound = await Application.find({handleBy: employeeId}).sort('jobId').populate({ path: "candidateId", select: "info" })
        if (applicationsFound) {
            return {
                total : applicationsFound.length,
                data: applicationsFound
            }
        } else {
            throw new Error("Not found")
        }
    },
    switch: async (applicationId, employeeHandleId, newEmployeeHandle, companyId) => {
        const [applicationFound, newEmployeeHandleFound] = await Promise.all([
            Application.findById(applicationId),
            User.findOne({ email: newEmployeeHandle, companyId, roleNumber: 2 })
        ]);

        if (applicationFound  && newEmployeeHandleFound) {

            if(applicationFound.handleBy.toString() == employeeHandleId.toString()){
                applicationFound.handleBy = newEmployeeHandleFound._id;
                const result = await applicationFound.save();
                if (result) {
                    return result;
                } else {
                    throw new Error("Cant attach to new employee")
                }
            }else{
                throw new Error("Wrong owner of application")

            }

        } else {
            throw new Error("Not found")
        }
    },
    approveByCompany: async (companyId, applicationId) => {
        const applicationFound = await Application.findById(applicationId);
        if (applicationFound && applicationFound.status.value == applicationDictionary.status.turnIn.value
            && applicationFound.companyId.toString() == companyId
            && applicationDictionary.created.isUser(applicationFound.createdBy)
        ) {
            applicationFound.status = applicationDictionary.status.approve;
            applicationFound.approvedAt = Date.now()

            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant approve")
            }
        } else {
            throw new Error("Not found")
        }
    },

    approveByUser: async (userId, applicationId) => {
        const applicationFound = await Application.findById(applicationId);
        if (applicationFound
            && applicationFound.status.value == applicationDictionary.status.turnIn.value
            && applicationDictionary.created.isCompany(applicationFound.createdBy)
            && applicationFound.candidateId.toString() == userId
        ) {
            applicationFound.status = applicationDictionary.status.approve;
            applicationFound.approvedAt = Date.now()

            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant approve")
            }
        } else {
            throw new Error("Not found")
        }
    },
    rejectByCompany: async (companyId, applicationId) => {
        const applicationFound = await Application.findById(applicationId);
        if (applicationFound
            && applicationFound.companyId.toString() == companyId

        ) {
            applicationFound.status = applicationDictionary.status.notQualify
            applicationFound.closeAt = Date.now()
            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant approve")
            }
        } else {
            throw new Error("Not found")
        }
    },



    rejectByUser: async (userId, applicationId) => {
        const applicationFound = await Application.findById(applicationId);
        console.log(applicationFound)
        if (applicationFound
            && applicationFound.candidateId.toString() == userId
        ) {
            applicationFound.status = applicationDictionary.status.rejectByUser
            applicationFound.closeAt = Date.now()

            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant approve")
            }
        } else {
            throw new Error("Not found")
        }
    },
    acceptToWork: async (userId, applicationId) => {
        const applicationFound = await Application.findById(applicationId);
        if (applicationFound
            && applicationFound.status.value == applicationDictionary.status.offer.value
            && applicationFound.candidateId.toString() == userId
            ) {
            const jobFound = await Job.findById(applicationFound.jobId)

            applicationFound.status = applicationDictionary.status.getHired;
            applicationFound.score = jobFound.info.score;
            applicationFound.closeAt = Date.now()
            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant approve")
            }
        } else {
            throw new Error("Not found")
        }
    },

    updateStatusByCompany: async (companyId, applicationId, type, statusIndex) => {
        const applicationFound = await Application.findById(applicationId).populate({ path: "jobId", select: "info.recruitmentProcess" })
        if (applicationFound
            && applicationFound.companyId.toString() == companyId
            && (applicationFound.status.value < applicationDictionary.status.rejectByUser.value
                || applicationFound.status.value < applicationDictionary.status.notQualify.value
                || applicationFound.status.value < applicationDictionary.status.getHired.value)

        ) {
            let interviewStatus = null;
            // console.log(applicationFound.jobId.info.recruitmentProcess)
            // đang giai đoạn approve mới được value 1 (approve --> interview)
            if (type == 'set-interview' && applicationFound.status.value == applicationDictionary.status.approve.value) {
                interviewStatus = applicationDictionary.status.interview
                if (applicationFound.jobId.info.recruitmentProcess.length > 0) {
                    interviewStatus.note = applicationFound.jobId.info.recruitmentProcess[0]
                }
                applicationFound.interviewedAt = Date.now()
                
            }
            // giai đoạn nếu có vòng phỏng vấn value 2 (invterview --> interview)
            if (type == 'continue-interview'
                &&
                (
                    applicationFound.status.value == applicationDictionary.status.interview.value
                    || (statusIndex == 0 && applicationFound.status.value == applicationDictionary.status.approve.value)
                )
                && applicationFound.jobId.info.recruitmentProcess.length > 0
            ) {
                interviewStatus = applicationDictionary.status.interview
                if (statusIndex >= applicationFound.jobId.info.recruitmentProcess.length) {
                    statusIndex = applicationFound.jobId.info.recruitmentProcess.length - 1
                }
                applicationFound.interviewedAt = Date.now()
                interviewStatus.note = applicationFound.jobId.info.recruitmentProcess[statusIndex]
            }
            // giai đoạn có thể ấn offer value 2 (interview --> offer)
            if (type == 'offer' && applicationFound.status.value == applicationDictionary.status.interview.value) {
                interviewStatus = applicationDictionary.status.offer
                applicationFound.offeredAt = Date.now()
            }
            if (!interviewStatus) {
                throw new Error("Something wrong with type")
            }
            applicationFound.status = interviewStatus;
            const result = await applicationFound.save();
            if (result) {
                return result;
            } else {
                throw new Error("Cant update status")
            }
        } else {
            throw new Error("Not found")
        }
    },



    commentCompany: async (_id, candidateId, comment) => {
        const applicationFound = await Application.findOne({ _id, candidateId });
        if (applicationFound && !applicationFound.candidateComment && applicationFound.status.value >= applicationDictionary.status.getHired.value) {
            applicationFound.candidateComment = comment;
            const result = await applicationFound.save();
            if (result) {
                return applicationFound.candidateComment;
            } else {
                throw new Error("Cant comment")
            }
        } else {
            throw new Error("Not found ")
        }
    },
    commentUser: async (_id, companyId, comment) => {
        const applicationFound = await Application.findOne({ _id, companyId });
        if (applicationFound && !applicationFound.companyComment && applicationFound.status.value >= applicationDictionary.status.getHired.value) {
            applicationFound.companyComment = comment;
            const result = await applicationFound.save();
            if (result) {
                return applicationFound.companyComment;
            } else {
                throw new Error("Cant comment")
            }
        } else {
            throw new Error("Not found ")
        }
    },
    updateModel: async() => {
        Application.updateMany({}, {
            $set: {
                "handle": "638cc6231f0417c720905eb6"
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

module.exports = ApplicationService;