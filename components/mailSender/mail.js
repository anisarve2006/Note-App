const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port: 465,
    auth:{
        user:'myshopii63@gmail.com',
        pass:'popmgxxijfxxyits'
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

sendMail("anirudhsarve14@gmail.com", "Testing Programmmed Email", "This is message 1");
