const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'devathon007@gmail.com',
        pass : 'nothaved@700'
    }
})

module.exports = (email, OTP) => {
    let mailOptions = {
        from : 'devathon007@gmail.com',
        to : email,
        subject : 'OTP FOR FACULTY PORTAL',
        text : 'OTP is ' + OTP
    }
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            console.log(err);
            throw 'email error !'
        }
    })
}