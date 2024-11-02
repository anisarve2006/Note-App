const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port: 465,
    auth:{
        user:'myshopii63@gmail.com',
        pass:'popmgxxijfxxyits'
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      }
});

function sendMail(to, sub, msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    })

    console.log("Email Sent");
}

sendMail("parthbhovad710@gmail.com", "Testing Programmmed Email", "This is message 1");
