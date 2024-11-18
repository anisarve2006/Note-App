const userModel = require("../models/userModel");
const noteModel = require("../models/noteModel")
const jwt = require("jsonwebtoken");

// Functions 
const create = async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email});
        if (!user) return res.redirect("/api/user/login");
        let note = await noteModel.create({
            title: req.body.title,
            notePicture: req.body.notePicture,
            // notePicture: req.file.path,
            content: req.body.content,
            userId: user._id,
        });
        // Add the note to the user's notes array
        await user.notes.push(note._id);
        await user.save();
       // Redirect to the note home page or render a success page
        res.redirect('/api/note/');
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"});
    }
    
}

//Index Route
const index = async (req, res) => {
    try {
        // console.log(req.user);
        let user = await userModel.findOne({email: req.user.email}).populate("notes");
        // const allNotes = await noteModel.find({userId: user._id});
        res.render("noteHomePage", { user });
    } catch (error) {
        console.log(error);  
        res.json({error:"Something went wrong"});
    }
}

const read = async (req, res) => {
    try {
        const note = await noteModel.findOne({ _id: req.params.id });
        // console.log(note);
        
        if (!note) {
            return res.json({ error: "Note not found or unauthorized access" });
        }
        res.render("viewNote", { note });
    } catch (error) {
        console.error(error);
        res.json({ error: "Something went wrong" });
    }
};

const remove = async (req, res) => {
    try {
        const note = await noteModel.findOneAndDelete({ _id: req.params.id });
        if (!note) {
            return res.json({ error: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ error: "Something went wrong" });
    }
}

const update = async (req, res) => {
    try {
        let note = await noteModel.findOneAndUpdate({_id: req.params.id}, {content : req.body.content}, {new: true});
        note.updatedAt = new Date();
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.render("viewNote", { note });
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
    index,
}
