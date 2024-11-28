require("dotenv").config();
const express = require('express');
const { create, update, read, remove, index, addImages } = require('../components/note');
const router = express.Router();
const isLoggedIn = require("../config/isLoggedIn");
const multer = require('multer');

// Different Folder For Note Images
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  
  // Configure Multer Storage for Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'note_images', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });
  const upload = multer({ storage });


// Post Routes
router.post('/new', isLoggedIn, upload.array('images', 10), create);
router.post('/update/:id', isLoggedIn, update);
router.post('/addImages/:id',isLoggedIn, upload.array('images', 10), addImages);
// Get Routes
router.get("/new",isLoggedIn, (req, res) => {res.render('createNote')});
router.get('/read/:id',isLoggedIn, read);
router.get('/remove/:id',isLoggedIn, remove);
router.get("/",isLoggedIn, index);

module.exports = router;
