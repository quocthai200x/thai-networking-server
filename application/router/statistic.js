var express = require("express")
var statisticService = require("../../domain/service/statistic")
var router = express.Router()
var auth = require("../../config/auth")
const authorize = require("../../config/authorize")
const { employee } = require("../../config/dictionary/role")

router.get('/', auth.required, authorize.canReadStatistic, async (req, res) => {
    try {
        const { from, to } = req.query;
        const {companyId} = req;
        const result = await statisticService.getAll(from, to, companyId);
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


module.exports = router