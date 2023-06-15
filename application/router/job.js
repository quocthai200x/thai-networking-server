var express = require("express")
var jobService = require("../../domain/service/jobService")
var router = express.Router()
var auth = require("../../config/auth")
const authorize = require("../../config/authorize")
var searchService = require("../../domain/service/searchService")




router.get('/jobs-name', auth.required, authorize.isCompany, async(req,res)=>{
    try {
        const { companyId } = req;
        const listJobsName = await jobService.getListJobsName(companyId);
        res.json(listJobsName);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.get('/status-count', auth.required, authorize.isCompany, async (req, res) => {
    try {
        const { companyId } = req;

        const countedJob = await jobService.getCountOfStatus(companyId);
        res.json(countedJob);


    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})
//  create new post
router.get('/user-favorite', auth.required, authorize.isUser, async (req, res) => {
    try {

        const { email } = req.payload;
        const jobFound = await jobService.getUserFavoriteJob(email)
        res.json(jobFound)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


router.get('/by-company-name/:companyName', async (req, res) => {
    try {
        const { companyName } = req.params;
        const jobFound = await jobService.getJobByCompanyName(companyName)
        res.json(jobFound)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.post('/', auth.required, authorize.canWriteRecruitment, async (req, res) => {
    try {
        const { companyId } = req;
        const createdJob = await jobService.create(companyId, req.body);
        res.json(createdJob);

    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

// update
router.put('/', auth.required, authorize.canWriteRecruitment, async (req, res) => {
    try {
        const { companyId } = req;
        const { info, jobName } = req.body;
        const updatedJob = await jobService.update(companyId, jobName, info);
        res.json(updatedJob);

    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.put('/update-attach-employer', auth.required, authorize.canWriteRecruitment, async (req, res) => {
    try {
        const { companyId } = req;
        const { jobName, recruiter } = req.body;
        const updatedJob = await jobService.updateAttachEmployer(companyId, jobName, recruiter);
        res.json(updatedJob);

    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


router.get("/others/:jobName_idCompany", auth.optinal, async (req, res) => {
    try {
        const { jobName_idCompany } = req.params;
        let arr = jobName_idCompany.split('---');
        const jobFound = await jobService.getOtherJobsByCompany(arr[0], arr[1])
        res.json(jobFound)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.get("/status/:status", auth.required, authorize.isCompany, async (req, res) => {
    try {
        const { companyId } = req;
        const { status } = req.params;
        const jobFound = await jobService.findByStatus(companyId, status);
        res.json(jobFound)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})



router.get("/:jobName_idCompany", auth.optinal, async (req, res) => {
    try {
        const { jobName_idCompany } = req.params;
        let arr = jobName_idCompany.split('---');
        const jobFound = await jobService.getJobByName(arr[0], arr[1])
        res.json(jobFound)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.put('/update-status', auth.required, authorize.canWriteRecruitment, async (req, res) => {
    try {
        const { companyId } = req;
        const { status, jobName } = req.body;
        const updatedJob = await jobService.updateStatus(companyId, jobName, status);
        res.json(updatedJob);

    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.put('/update-view/:jobName_idCompany', auth.required, authorize.isUser, async (req, res) => {
    try {
        const { jobName_idCompany } = req.params;
        let arr = jobName_idCompany.split('---');
        const updated = await jobService.updateView(arr[0], arr[1])
        res.json(updated)
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.get("/count-in-field/:field", async (req, res) => {
    // console.log("ab");
    try {
        const { field } = req.params
        const result = await jobService.countInField(field);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})

router.put('/update-model-all', async  (req, res) => {
    try {
        const updatedJob = await jobService.updateModel();
        res.json(updatedJob);
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        })
    }
})


// router.get("/",auth.required ,async (req, res) => {
//     const result = await postService.getPost()
//     console.log(result)
//     const listPost = result.map(postModel => (
//         {
//             id: postModel.id,
//             email : postModel._doc.email,
//             content : postModel._doc.content,
//             imageUrl : postModel._doc.imageUrl,
//             // numberOfLike :,
//         }
//     ))
//     res.json(listPost)
// })


// router.post("/:id/like",auth.required,async(req,res)=>{
//     const {email} = req.payload;
//     const {id} = req.params 
//     const like = await postService.like(id,email)
//     res.json ({
//         liked :like.indexOf(email)> -1,
//         numberOfLike : like.length
//     });

// });

// router.post("/:id/comment",async (req,res)=>{
//         const {email,content} = req.body;
//         const {id} = req.params;
//         await postService.comment(id,email,content);
//         res.json({
//             email : email,
//             content : content,
//         })

// })

// router.get('/:id/comments',async (req,res)=>{
//     const {id} = req.params;
//     const result =  await postService.loadComment(id)
//     res.json(result)
//     // res.json(result)
// })






module.exports = router