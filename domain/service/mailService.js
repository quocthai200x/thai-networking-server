// const { google } = require("googleapis");
const nodemailer = require("nodemailer");
// const { MailtrapClient } = require("mailtrap");


const TOKEN = "your-api-token";
const SENDER_EMAIL = "sender@yourdomain.com";
const RECIPIENT_EMAIL = "recipient@email.com";

const Mail = {
    sendMail: async (toMail, password) => {
        const CLIENT_ID = process.env.CLIENT_ID
        const CLIENT_SECRET = process.env.CLIENT_SECRET
        const REDIRECT_URI = process.env.REDIRECT_URI
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN

        // const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
        // oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        // const accessToken = await oAuth2Client.getAccessToken();

        // let transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: "quocthai2000xx@gmail.com", // generated ethereal user
        //         pass: "Thai123456", // generated ethereal password
        //     },
        // });
        let transporter = nodemailer.createTransport({
            service: "Gmail", // SMTP server address (usually mail.your-domain.com)
            // port: 465, // Port for SMTP (usually 465)
            // secure: true, // Usually true if connecting to port 465
            auth: {
              user: "quocthai2000xx@gmail.com", // Your email address
              pass: "ctzhmrmkbjrxaasu", // Password (for gmail, your app password)
              // ⚠️ For better security, use environment variables set on the server for these values when deploying
            },
          });
        // let transporter = nodemailer.createTransport({
        // service: "gmail",
        // auth: {
        //     type: "OAuth2",
        //     user: "quocthai2000xx@gmail.com",
        //     clientId: CLIENT_ID,
        //     clientSecret: CLIENT_SECRET,
        //     refreshToken: REFRESH_TOKEN,
        //     accessToken,
        // },
        // service: 'gmail',
        // auth: {
        //   type: 'OAuth2',
        //   user: process.env.MAIL_USERNAME,
        //   pass: process.env.MAIL_PASSWORD,
        //   clientId: process.env.OAUTH_CLIENTID,
        //   clientSecret: process.env.OAUTH_CLIENT_SECRET,
        //   refreshToken: process.env.OAUTH_REFRESH_TOKEN
        // }
        // });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Thai-networking" <quocthai2000xx@gmail.com>', // sender address
            to: toMail,
            subject: 'Thư tạo tài khoản công ty',
            text: 'You recieved message from Thai worknet',
            html: '<p>You have got a new message</b><ul><li>Tên tài khoản:' + toMail + '</li><li>Password:' + password + '</li></ul>'
        });
        console.log("" + JSON.stringify(info))
        if (info) {
            return true
        } else {
            return false
        }

        // mailtrap
        // const client = new MailtrapClient({ token: TOKEN });
        // const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

        // client
        //     .send({
        //         from: sender,
        //         to: [{ email: toMail }],
        //         subject: "Hello from Mailtrap!",
        //         html: '<p>You have got a new message</b><ul><li>Tên tài khoản:' + toMail + '</li><li>Password:' + password + '</li></ul>'

        //     })
        //     .then(console.log, console.error);

    }
}


module.exports = Mail