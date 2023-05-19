const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const Users = require("../domain/model/users")

passport.use(
    new LocalStrategy({
        usernameField : "email",
        passwordField : "password",
    }
    ,(email,password,done)=>{
        Users.findOne({email}).then(
            user=>{
                if(!user || !user.validPassword(password)){
                    return done(null,false,{
                        err: "Email or Password is invalid"
                    })
                }
                return done(null,user);
            }
        );

    }
    ) 
)
