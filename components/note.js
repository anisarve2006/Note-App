const userModel = require("../models/userModel");
const noteModel = require("../models/noteModel")
const create = async (req, res) => {
    try {
        let token = req.cookies.token;
        if(!token) return res.json({message : "Invalid token"})
        let decodedEmail = jwt.verify(token, process.env.jwtSecret);
        let user = await userModel.findOne({email: decodedEmail});
        let note = await noteModel.create({
            title: req.body.title,
            content: req.body.content,
            user: user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        user.notes.push(note);
        await user.save();
        //res.json({message:"Note created successful"});
        res.redirect('noteHomePage');
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"});
    }
    
}

const read = async (req, res) => {  
    try { 
        let note = await noteModel.findOne({_id: req.params.id}); 
        if(!note) return res.json({error:"Note not found"});
        //res.json(note);  // way to open code page
        res.render(createNote);
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
    remove
}
