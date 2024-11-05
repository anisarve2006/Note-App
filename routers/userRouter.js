const express = require('express');
const {login, register, remove} = require('../components/useroperations/user.js');
const router = express.Router();

router.route("/login").get((req, res) => {
    res.render("login")
});
router.route("/login").post(login);

router.route("/create").get((req, res) => {
     res.render("registration");
});
router.route("/create").post(register);

router.route('/remove').post(remove);
module.exports = router;