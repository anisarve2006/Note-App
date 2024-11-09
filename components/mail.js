const nodemailer = require('nodemailer');

// configure Nodemailer instance
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

// function to generate 4 digit code 
function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

// function to send email with verification code
const sendVerificationEmail = async (email, code) =>{
    try {
        transporter.sendMail({
            to:email,
            subject: 'Email Verification Code',
            html:`<h1 align='center'>Noto</h1><p>Your verification code is ${code} </p>`
        })
        console.log("Verification Email Sent");
    } catch (error) {
        console.log("Error sending Email :", error); 
    }
    
}

module.exports = {sendVerificationEmail, generateVerificationCode};
