require('dotenv').config()

var express = require("express")
var bodyParser = require('body-parser')
var cors = require("cors")
var sessions = require("client-sessions");
var app = express();

var morgan = require("morgan")
var router = require("./application/router")
var path = require("path")
const port = process.env.port || 6969;
// console.log(process.env.NODE_ENV.trim())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:5173",
        'http://localhost:1234', 
        "http://localhost:2345",
        "https://project-iii-front.vercel.app", 
        "https://project-iii-front-company.vercel.app",
        "https://thai-networking.vercel.app",
        "https://thai-networking-business.vercel.app",
        "https://thai-networking-admin.vercel.app"
    ],
    credentials: true
}
))
// if (!(process.env.NODE_ENV.trim() === 'development')) {
//     app.set('trust proxy', true)
// }

// app.use(sessions({
//     cookieName: "session",
//     secret: process.env.SESSION_SECRET,
//     duration: process.env.MY_IMPOSSIIBLE_SECRET,
//     activeDuration: parseInt((new Date()).getTime() / 1000, 10),
//     cookie: {
//         // httpOnly: true,
//         ephemeral: false,
//         // domain: process.env.NODE_ENV.trim() === 'development' ? undefined:"project-iii-front.vercel.app",
//         // secureProxy: process.env.NODE_ENV.trim() === 'development' ? false : true,
//         // sameSite: process.env.NODE_ENV.trim() === 'development' ? true : "none",
//     }
// }));

// app.use(function(req, res, next) {
//     if (req.session.seenyou) {
//       res.setHeader('X-Seen-You', 'true');
//     } else {
//       // setting a property will automatically cause a Set-Cookie response
//       // to be sent
//       req.session.seenyou = true;
//       res.setHeader('X-Seen-You', 'false');
//     }
//     // console.log(res.header('X-Seen-You'))
//     next()
//   });

// app.use((req, res, next)=>{
//     if(!(process.env.NODE_ENV.trim() === 'development')){
//         console.log("DZO")
//         app.set('trust proxy', true)
//         req["session"].secure = true;
//         req['session'].secureProxy = true
//     }
//     next();
// });


app.use(morgan("dev"))
require("./config/passport")
app.use(router)
app.get('/', function (req, res, next) {
    res.send('<h1>Đã kết nố</h1>')
})

// app.use(express.static("static"));
app.use("/static", express.static(path.join(__dirname + '/static')));

app.listen(port, () => console.log(`app is running at ${port}`))