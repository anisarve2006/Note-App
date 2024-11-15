const express = require('express');
const router = express.Router();
const multer = require('multer');
const { create, login, update, logout, remove } = require('../components/user');
const { storage } = require('../config/cloudconfig');
const upload = multer({ storage });


// POST routes
// verification requirements 
const {sendVerificationEmail, generateVerificationCode} = require('../components/mail');
const {storeVerificationCode, getVerificationCode} = require('../config/verification');
// Endpoint to send the verification code
router.post('/send-verification', async (req, res) => {
    const email = req.body.email;
    const code = generateVerificationCode();
    storeVerificationCode(email, code);
    await sendVerificationEmail(email, code);
    res.json({ message: 'Verification code sent' });  // way to open code page
  });
// Endpoint to verify the code
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    const storedCode = getVerificationCode(email);
  
    if (storedCode && storedCode === parseInt(code, 10)) {
      verificationCodes.delete(email); // Clear code on successful verification
      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired verification code' });
    }
  });


router.post('/create', upload.single('image'), create);
router.route("/login").post(login);

router.route("/login").get((req, res) => res.render("login"));

router.route("/create").get((req, res) => {
     res.render("registration");
});
router.route("/create").post(create);

router.route('/remove').post(remove);

router.route("/forgotpassword").get((req, res) => res.render("forgotPassword"));

module.exports = router;