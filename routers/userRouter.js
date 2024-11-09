const express = require('express');
const multer = require('multer');
const { create } = require('../components/user');
const { storage } = require('../config/cloudconfig');

const router = express.Router();
const upload = multer({ storage });

router.post('/create', upload.single('image'), create);
// router.route("/login").post(login);
// router.route('/remove').post(remove);

module.exports = router;










