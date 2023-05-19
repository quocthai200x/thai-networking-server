const { expressjwt: jwt } = require("express-jwt")

const getToken =(req)=> {
    const {headers:{authorization}} = req;
    // console.log(authorization.split(" ")[1])
    if(authorization && authorization.split(" ")[0] == "Bearer"){
        // console.log(authorization.split(" ")[1])
        return authorization.split(" ")[1];
    }else{
        return null;
    }
    // if (!(req.session && req.session.userToken)) {
    //     return null;
    // }
    // // console.log(req.session.userToken)
    // return req.session.userToken

}
const auth ={
    required :jwt({
        secret : process.env.JWT_SECRET,
        requestProperty: "payload",
        algorithms: ['HS256'],
        getToken : getToken
    }) ,
    optinal: jwt({
        secret : process.env.JWT_SECRET,
        requestProperty: "payload",
        getToken : getToken,
        credentialsRequired : false,
        algorithms: ['HS256'],

    }),
}

module.exports = auth
