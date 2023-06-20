const express = require("express")
const router = express.Router()
const userService = require("../../domain/service/userService")
const roleService = require("../../domain/service/roleService")
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")



router.put("/", auth.required, async (req, res) => {
    const { email } = req.payload;
    try {
        const updateUser = await userService.update(email, req.body);
        res.json(updateUser)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

})

router.get("/employee", auth.required, authorize.canReadSystemSettings, async (req, res) => {
    const { companyId } = req;
    try {
        const list = await userService.getAllEmployeeOfCompany(companyId);
        res.json(list)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.get("/handler/:jobName", auth.required, authorize.isEmployer, async (req, res) => {
    const { companyId } = req;
    const {jobName} = req.params;
    try {
        const list = await userService.getAllEmployerByJobName(companyId, jobName);
        res.json(list)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})



router.post("/attach-role", auth.required, authorize.canWriteUserPermission, async (req, res) => {
    const { roleName, targetEmail } = req.body;
    const { companyId } = req;
    try {
        const attached = await roleService.attachRole(roleName, targetEmail, companyId);
        res.json(attached)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})
router.get('/candidate/:userId', auth.required, authorize.isCompany, async(req,res)=>{
    const { userId } = req.params 
    try {
        const candidate = await userService.getCandidate(userId);
        res.json(candidate)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})



router.get('/get-all-company-email', async (req, res) => {
    try {
        const allEmail = await userService.getAllEmailCompany();
        res.json(allEmail)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})




router.get('/get-all-user-email', async (req, res) => {
    try {
        const allEmail = await userService.getAllEmailUser();
        res.json(allEmail)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})



router.post("/:id/like", auth.required, authorize.isUser, async (req, res) => {
    const { email } = req.payload;
    const arr = req.params.id.split('---');
    try {
        const like = await userService.likeJob(email, arr[0], arr[1])
        res.json({
            like
        });
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }

});

// router.put('/update-model-all', async  (req, res) => {
//     try {
//         const updatedJob = await userService.updateModel();
//         res.json(updatedJob);
//     } catch (err) {
//         res.status(400);
//         res.json({
//             code: err.message
//         })
//     }
// })

// router.post("/:following/follow", async (req, res) => {
//     const { follower } = req.body;
//     const { following } = req.params
//     console.log(follower, following)
//     const result = await userService.follow(follower, following);
//     if (result === true) {
//         res.json({
//             success: 'true',
//             follower,
//         })
//     } else {
//         // TODO 
//     }
// })

// router.post("/:following/unfollow", async (req, res) => {
//     const { follower } = req.body;
//     const { following } = req.params
//     console.log(follower, following)
//     const result = await userService.unFollow(follower, following);
//     if (result === true) {
//         res.json({
//             success: 'true',
//             follower,
//         })
//     } else {
//         // TODO 
//     }
// })


// router.get("/",async  (req, res) => {
//     const queryString = req.query.q;
//     const result = await userService.search(queryString);
//     res.send({
//         result : result,
//         total :result.length,
//     });


// })


module.exports = router;