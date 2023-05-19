const express = require("express")
const searchService = require("../../domain/service/searchService")
const router = express.Router()
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")


router.post("/job" , async(req,res)=>{
    try {
        const {pageNumber, limit} = req.query
        const result = await searchService.searchJob(req.body, pageNumber, limit);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})
router.post("/company" , async(req,res)=>{
    try {
        const {pageNumber, limit, } = req.query
        const {keyword} = req.body
        const result = await searchService.searchCompany(keyword, pageNumber, limit);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.post("/candidate", auth.required, authorize.canSearchCandidate,  async(req,res)=>{
    try {
        const {pageNumber, limit} = req.query
        const {companyId } = req
        const result = await searchService.searchCandidate( companyId, req.body , pageNumber, limit);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


router.get("/candidate-for-company", auth.required, authorize.isCompany,  async(req,res)=>{
    try {
        const {pageNumber, limit } = req.query
        const result = await searchService.searchCandidateForCompany(req.companyId, pageNumber, limit);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


module.exports = router;
