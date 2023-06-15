var express = require("express")
var applicationService = require("../../domain/service/applicationService")
var router = express.Router()
var auth = require("../../config/auth")
const authorize = require("../../config/authorize")
const { employee } = require("../../config/dictionary/role")


router.get('/', auth.required, authorize.canReadApplier, async(req,res)=>{
    const {companyId} = req;
    const {applicationId} = req.query
    try {
        const result = await applicationService.findOneInCompany(applicationId, companyId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.get('/by-job-name', auth.required, authorize.canReadApplier, async(req,res)=>{
    const {companyId, employeeId} = req;
    const {jobName} = req.query
    try {
        const result = await applicationService.findByJobName(jobName, companyId, employeeId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})



router.get("/by-user-with-job", auth.required, authorize.isUser, async(req,res) =>{
    const {userId} = req;
    const {jobId} = req.query
    try {
        const result = await applicationService.findWithCandidateAndJobID(userId, jobId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
    
})
router.get("/by-user", auth.required, authorize.isUser, async(req,res) =>{
    const {userId} = req;
    try {
        const result = await applicationService.getAllByUser(userId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
    
})



router.get("/by-company", auth.required, authorize.canReadApplier, async(req,res) =>{
    const {companyId} = req;
    try {
        const result = await applicationService.getAllByCompany(companyId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
    
})


router.get("/not-close", auth.required, authorize.isEmployer, async(req,res) =>{
    const {companyId, employerId} = req;
    try {
        const result = await applicationService.getNotClose(companyId, employerId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
    
})


router.get("/by-employee", auth.required, authorize.canReadApplier, async(req,res) =>{
    const {employeeId} = req;
    try {
        const result = await applicationService.getAllByEmployee(employeeId)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
    
})

router.post("/apply", auth.required, authorize.isUser, async (req, res) => {
    const {userId} = req
    const {jobName, companyId, employeeHandle} = req.body;
    try {
        const createApplication = await applicationService.apply(userId, jobName, companyId, employeeHandle);
        res.json(createApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})


router.post("/invite", auth.required, authorize.canWriteApplier, async (req, res) => {
    const {companyId} = req;
    const {candidateEmail, jobName, employeeHandle} = req.body
    try {
        const createApplication = await applicationService.invite(jobName, candidateEmail,companyId, employeeHandle);
        res.json(createApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})


router.put("/switch-handdle-by", auth.required, authorize.canWriteApplier, async (req, res) => {
    const {companyId, employeeHandleId} = req;
    const {applicationId, newEmployeeHandle} = req.body
    try {
        const switchApplication = await applicationService.switch(applicationId, employeeHandleId,newEmployeeHandle, companyId);
        res.json(switchApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})

router.put('/approve-by-user', auth.required, authorize.isUser, async(req, res)=>{
    const {userId} = req
    const {applicationId} = req.body;
    try {
        const approveApplication = await applicationService.approveByUser(userId, applicationId);
        res.json(approveApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.put('/reject-by-user', auth.required, authorize.isUser, async(req, res)=>{
    const {userId} = req
    const {applicationId} = req.body;
    try {
        const rejectApplication = await applicationService.rejectByUser(userId, applicationId);
        res.json(rejectApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.put('/approve-by-company', auth.required, authorize.canWriteApplier, async(req, res)=>{
    const {companyId} = req;
    const {applicationId} = req.body
    try {
        const approveApplication = await applicationService.approveByCompany(companyId, applicationId);
        res.json(approveApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})
router.put('/reject-by-company', auth.required, authorize.canWriteApplier, async(req, res)=>{
    const {companyId} = req;
    const {applicationId} = req.body
    try {
        const rejectApplication = await applicationService.rejectByCompany(companyId, applicationId);
        res.json(rejectApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.put('/accept-to-work', auth.required, authorize.isUser, async(req, res)=>{
    const {userId} = req
    const {id} = req.body;
    try {
        const rejectApplication = await applicationService.acceptToWork(userId, id);
        res.json(rejectApplication)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.put("/change-status", auth.required, authorize.canWriteApplier, async(req,res)=>{
    const {companyId} = req;
    const {id, interviewIndex, type} = req.body;
    try {
        const result = await applicationService.updateStatusByCompany(companyId, id, type, interviewIndex)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.put('/update-model-all', async  (req, res) => {
    try {
        const updatedJob = await applicationService.updateModel();
        res.json("OK");
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})









router.post("/user-comment", auth.required, authorize.isUser, async(req,res)=>{
    const {userId} = req;
    const {comment,id} = req.body;
    try {
        const result = await applicationService.commentCompany(id, userId, comment)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.post("/company-comment", auth.required, authorize.canWriteApplier, async(req,res)=>{
    const {companyId} = req;
    const {comment,id} = req.body;
    try {
        const result = await applicationService.commentUser(id, companyId, comment)
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})





module.exports = router