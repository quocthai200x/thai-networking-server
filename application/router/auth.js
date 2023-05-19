var express = require("express")
var passport = require("passport")
var passportLocal = require("passport-local")
var router = express.Router()
var authService = require("../../domain/service/authService")
var userService = require("../../domain/service/userService")
var auth = require("../../config/auth")
var authorize = require("../../config/authorize")
const { Auth } = require("googleapis")

router.post("/check-email", async(req,res)=>{
    const {email} = req.body;
    try {
        const response = await authService.checkMailExisted(email);
        res.json({
           response
        });
    } catch (err) {
        res.status(400);
        res.json({
            code: err.message
        });
    }
})

router.post("/login", async (req, res,next) => {
    const {email,password} = req.body;
   
    if(!email || !password){
        res.status(400);
        res.json({
            code: "Please fill field"
        });
    }else{
       
        return  passport.authenticate("local",{session:false},(err,user,next)=>{
            if(err){
                console.log(err);
                res.status(400);
                res.json({
                    message: err.message
                });
            }
            if(user){
                return res.json({
                    email:user.email,
                    token : user.generateJWT(req ,res)
                })
            }else if(!user){
                res.status(400);
                res.json({
                    code:"user not found"
                });
            }
        })(req,res,next);
    }

})

router.post("/register-user", auth.optinal, async (req, res) => {
    const { email, password, name, phone } = req.body;
    
    try {
        const user = await authService.signUpUser(email, password, name, phone);
        res.json({
            token: user.generateJWT(req ,res)
        });
    } catch (err) {
        res.status(400);
        res.json({
            email: err.message
        });
    }
})

router.post("/register-admin", auth.optinal, async (req, res) => {
    const { email, password, companyData } = req.body;
    try {
        const user = await authService.signUpAdmin(email, password, companyData);
        res.json({
            token: user.generateJWT(req ,res)
        });
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})


router.post("/register-employee", auth.required, authorize.isAdmin, async (req, res) => {
    const { email, roleName, name } = req.body;
    try {
        const user = await authService.addEmployee(email, req.companyId, roleName, name);
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})



router.get("/me",auth.required, async(req,res)=>{
    // console.log(req.payload)
    try{
        const user = await userService.find(req.payload.email)
        // user.generateJWT(req ,res)
        res.json({user})
    }catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.post("/change-password", auth.required, async(req,res)=>{
    try {
        const {email} = req.payload;
        const {oldPass, newPass} = req.body;
        const changedPass = await authService.changePass(email, oldPass, newPass)
        res.json({
            token: changedPass.generateJWT(req ,res)
        });
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.post('/forgot-password', async(req,res)=>{
    try {
        const {email} = req.body;
        const forgotPassword=  await authService.forgotPassword(email);
        res.json(true)
    } catch (err) {
        res.status(400);
        res.json({
            error: err.message
        });
    }
})

router.post("/logout", (req, res) => {
    try {
        if (req.session) {
            req.session.reset();
          }
        res.json({success: true})
    } catch (err) {
        res.status(400);
        res.json({
            success: false
        });
    }
})


module.exports = router;