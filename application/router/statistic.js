var express = require("express")
var statisticService = require("../../domain/service/statisticService")
var router = express.Router()
var auth = require("../../config/auth")
const authorize = require("../../config/authorize")


router.get('/', auth.required, authorize.canReadStatistic, async (req, res) => {
    try {
        const { from, to, employerEmail, jobName } = req.query;
        const {companyId} = req;
        const result = await statisticService.getAll(from, to, employerEmail, jobName, companyId);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.get('/based-employer', auth.required, authorize.canReadStatistic, async(req,res)=>{
    try {
        const { from, to, email } = req.query;
        const {companyId} = req;
        const result = await statisticService.getBasedEmployer(from, to, companyId, email);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.get('/candidate-funnel', auth.required, authorize.canReadStatistic, async(req,res)=>{
    try {
        const { from, to, employerEmail, jobName } = req.query;
        const {companyId} = req;
        const result = await statisticService.getCandidateFunnel(from, to, employerEmail, jobName, companyId);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})



router.get('/created-by', auth.required, authorize.canReadStatistic, async(req,res)=>{
    try {
        const { from, to, employerEmail, jobName } = req.query;
        const {companyId} = req;
        const result = await statisticService.getCreatedBy(from, to, employerEmail, jobName, companyId);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})




router.get('/get-list-statistics', auth.required, authorize.canReadStatistic, async(req,res)=>{
    try {
        const { from, to, employerEmail, jobName } = req.query;
        const {companyId} = req;
        const result = await statisticService.getListStatistic(from, to, employerEmail, jobName, companyId);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


router.get('/get-leaderboard', auth.required, authorize.canReadStatistic, async(req,res)=>{
    try {
        const { from, to, employerEmail, jobName } = req.query;
        const {companyId} = req;
        const result = await statisticService.getLeaderBoard(from, to, employerEmail, jobName, companyId);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})



module.exports = router