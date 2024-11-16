const userModel = require("../models/userModel");
const noteModel = require("../models/noteModel")
const jwt = require("jsonwebtoken");
const create = async (req, res) => {
    try {
        let token = req.cookies.token;
        if(!token) return res.json({message : "Invalid token"})
        let decodedEmail = jwt.verify(token, process.env.jwtSecret);
        let user = await userModel.findOne({email: decodedEmail.email});
        let note = await noteModel.create({
            title: req.body.title,
            notePicture: req.body.notePicture,
            content: req.body.content,
            user: user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        })
       await user.notes.push(note._id);
        await user.save();
        //res.json({message:"Note created successful"});
        res.render('noteHomePage');
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"});
    }
    
}

//Show Route
const showAll = async (req, res) => {
    try {
        const allNotes = await noteModel.find();
        res.render("noteHomePage", { allNotes });
    } catch (error) {
        
    }
}

const read = async (req, res) => {  
    try { 
        let note = await noteModel.findOne({_id: req.params.id}); 
        if(!note) return res.json({error:"Note not found"});
        //res.json(note);  // way to open code page
        res.render("viewNote", { note });
    } catch (error) {
        console.log(error);  
        res.json({error:"Something went wrong"});
    }
    
}

const remove = async (req, res) => {
    try {
        await noteModel.findOneAndDelete({_id: req.params.id});
        res.json({message:"Note Deleted successfully"});
    } catch (error) {
        console.log(error);
        res.json({error:"Something went wrong"});
    }
    
}

const update = async (req, res) => {
    try {
        let note = await noteModel.findOneAndUpdate({_id: req.params.id}, {content : req.body.content});
        note.updatedAt = new Date();
        res.json({message:"Note edited successful"});
    } catch (error) {
        console.log(error);
        res.json({error:"Something went wrong"});
    }
    
}

module.exports = {  
    create,
    update,
    read,
    remove,
    showAll,
}
