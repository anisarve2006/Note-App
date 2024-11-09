require("dotenv").config();

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Mongoose utils
const mongoose = require('mongoose');
const userModel = require("../models/userModel");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


// Password hashing utils
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const create = async (req, res) => {
  console.log(req.file);
  try {
    // File Upload Status
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // User Existence in database status
    let doesExist = await userModel.findOne({ email: req.body.email });
    if (doesExist) {
        return res.send("User already registered");
    }

    // Registering User If Not Registered
    const {name, email, password} = req.body;
    //// hasing the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(req.file.path);
    const newUser = new userModel({profileUrl: req.file.path, username: name, email: email, password: hash});
    await newUser.save();
    return res.status(201).json({ message: 'User profile created successfully', name, email, password});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error uploading profile image', error });
    }
};


module.exports = { create };







// // login Functions
// const login = async (req, res) => {
//     res.send("Login Page...");
//     // try {
//     //     let user = await userModel.findOne({email: req.body.email});
//     //     if(user.password === req.body.password){
//     //         let token = jwt.sign({ email: user.email }, "secret");
//     //         res.cookie("token", token);
//     //         res.send("Login successful");
//     //     }
//     // } catch (error) {
//     //     console.log(error);
//     // }
    
// }

// const remove = async (req, res) => {
//     try {
//         let user = await userModel.findOneAndDelete({ email: req.body.email });
//     } catch (error) {
//         console.log(error);
//     }
// }


