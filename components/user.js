require("dotenv").config();

// Mongoose utils
const mongoose = require('mongoose');
const userModel = require("../models/userModel");
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


// Password hashing utils
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Creating a New User Account 
const create = async (req, res) => {
  try {
    // File Upload Status
    // if (!req.file) {
    //     return res.status(400).json({ error: "No file uploaded" });
    // }
    console.log(req.body);
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
    const newUser = new userModel({profileUrl: req.file.path, name: name, email: email, password: hash});
    await newUser.save();
    //return res.status(201).json({ message: 'User profile created successfully', name, email, password});
    res.render('noteHomePage');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error uploading profile image', error });
    }
};


// Login User
const login = async (req, res) => {
  try {
    let user = await userModel.findOne({email : req.body.email});
    if (!user ||!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    let token = jwt.sign({ email: user.email }, process.env.jwtSecret);
    res.cookie("token", token, {httpOnly:true});
    //res.json({message : 'Login Successfully'});
    res.render('noteHomePage');
  } catch(error) {
      console.log(error);
      return res.status(500).json({message : 'Login Failed'});
  }
}
// Update User 
const update = async (req, res) => {
  try {
    let token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });;
    const decoded = jwt.verify(token, process.env.jwtSecret);
    let user = await userModel.findOneAndUpdate({email : decoded.email}, req.body, {new: true});
    res.json({message : 'User Updated Successfully', user});
    

  } catch (error) {
    console.log(error);
    return res.status(500).json({message : 'User Update Failed'});
  }
 
}

// logout user 
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({message : 'Logged Out Successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message : 'Log Out Failed'});
  }

}

// Remove User 
const remove = async (req, res) => {
  try {
    let token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });;
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const deletionUser = await userModel.deleteOne({email : decoded.email});
    res.clearCookie("token");
    res.json({message : 'Accound Deletion Successfully'});

  } catch (error) {
    console.log(error);
    return res.status(500).json({message : 'Account Deletion Failed'});
  }
}

module.exports = { create, login, update, logout, remove};