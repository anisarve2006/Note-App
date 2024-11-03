// config.js
const express = require('express');
const cloudinary = require('cloudinary').v2;
// other required modules

// Set up configurations or create functions
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const app = express();

// Export configurations or app
module.exports = cloudinary;
