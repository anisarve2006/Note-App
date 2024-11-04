const express = require('express');
const {login, register, remove} = require('../components/useroperations/user.js');
const router = express.Router();
router.route("/login").post(login);
router.route("/create").post(register);
router.route('/remove').post(remove);
module.exports = router;