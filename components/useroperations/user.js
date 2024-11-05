const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    try {
        res.json({message:"Login successful"});
    } catch (error) {
        console.log(error);
    }
    
}

const register = async (req, res) => {  
    try {  

        let user = await userModel.findOne({ email: req.body.email });

        if (user) {
            return res.send("User already registered");
        }

       bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function(err, hash) {
            const userCreated = await userModel.create({
                profilePic : req.body.profilePic,
                fullName: req.body.fullName,
                email: req.body.email,
                password: hash   
            });
            let token = jwt.sign({ email: req.body.email, userid: userCreated._id }, "secret");
            res.cookie("token", token);
            res.send("regitered");
        });
    });
    } catch (error) {
        console.log(error);  
    }
    
}

const remove = async (req, res) => {
    try {
        res.json({message:"Removed successful"});
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {  
    login,
    register,
    remove
}
