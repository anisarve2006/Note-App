require("dotenv").config();  // to read .env file (environment variable)
const express = require('express');
const cloudinary = require('./components/imageToUrl/cloudinary.js'); // clodinary, an image hosting site
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require('path');
const mongoose = require('mongoose'); // database purpose
const app = express();

app.set('view engine' , "ejs"); 
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "png"],
    },
  });
const upload = multer({ storage });

// Routing parameters
app.get('/' , (req, res) => {
    res.render('index');
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const imageUrl = req.file.path; // URL of the uploaded image
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
  });


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port http://localhost:3000/`);
});
  

