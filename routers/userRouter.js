const express = require('express');
const router = express.Router();
const multer = require('multer');
const { create, login, update, logout, remove } = require('../components/user');
const { storage } = require('../config/cloudconfig');
const upload = multer({ storage });
const jwt = require("jsonwebtoken");

// POST routes
// verification requirements 
const {sendVerificationEmail, generateVerificationCode} = require('../components/mail');
const {storeVerificationCode, getVerificationCode, deleteVerificationCode} = require('../config/verification');
const isLoggedIn = require('../config/isLoggedIn');
// Endpoint to send the verification code
router.post('/send-verification', async (req, res) => {
    const email = req.body.email;
    const code = generateVerificationCode();
    storeVerificationCode(email, code);
    await sendVerificationEmail(email, code);
    res.render('codeVerification', { email });
  });
// Endpoint to verify the code
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    const storedCode = getVerificationCode(email);
    if (storedCode && storedCode === parseInt(code, 10)) {
      deleteVerificationCode(email); // Clear code on successful verification
      console.log('User verified');
      let token = jwt.sign({ email }, process.env.jwtSecret);
      res.cookie("token", token, {httpOnly:true});
      res.redirect('/api/note/');
    } else {
      res.status(400).json({ message: 'Invalid or expired verification code' });
    }
  });


router.route("/create").get((req, res) => res.render("registration")).post(upload.single('image'), create);
router.route("/login").get((req, res) => res.render("login")).post(login);
router.route("/forgotpassword").get((req, res) => res.render("forgotPassword"));
router.route("/logout").post(logout);
router.route("/remove").get(isLoggedIn, remove);

module.exports = router;

