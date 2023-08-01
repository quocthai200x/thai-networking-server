const express = require("express")
const router = express.Router()
const fakerService = require("../../domain/service/fakerService")
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")



router.post("/fake-jobs", async (req, res) => {
    try {
        const result = await fakerService.fakeJobs();
        res.json(result)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})




module.exports = router;