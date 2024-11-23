const userModel = require("../models/userModel");
const noteModel = require("../models/noteModel")
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;

// Functions 
const create = async (req, res) => {
    try {
        let user = await userModel.findOne({email: req.user.email});
        if (!user) return res.redirect("/api/user/login");
        console.log(req.file);

        // Getting Images 
        const files = req.files;
        const uploadedUrls = files.map((file) => file.path);

        let note = await noteModel.create({
            title: req.body.title,
            // notePicture: req.body.notePicture,
            notePicture: uploadedUrls,
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
        const images = note ? note.notePicture : [];
        
        if (!note) {
            return res.json({ error: "Note not found or unauthorized access" });
        }
        console.log(note);
        console.log(note.id);
        res.render("viewNote", { note, images});
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
        res.redirect('/api/note/');
    } catch (error) {
        console.error(error);
        res.json({ error: "Something went wrong" });
    }
}

const update = async (req, res) => {
    console.log('Request Body', req.body);
    try {
        const { title, content, selectedImages } = req.body;
        const urls = JSON.parse(selectedImages);

        // Fetch the existing note
        const note = await noteModel.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        // Identify images to delete
        const toDelete = note.notePicture.filter((url) => !urls.includes(url));
        // Delete images from Cloudinary
        for (const url of toDelete) {
            const publicId = extractPublicId(url);
            try {
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted from Cloudinary: ${publicId}`);
              }
            } catch (error) {
              console.error(`Error deleting ${publicId} from Cloudinary:`, error);
            }
        }
        
        // Update the Note in MongoDB
        note.title = title;
        note.content = content;
        note.notePicture = urls;
        await note.save();
        res.redirect('/api/note');
          
    } catch (error) {
        console.log(error);
        res.json({ message: 'Note updation failed'});
    }
}

const addImages = async (req, res) => {
    console.log("AddImages function working");
    try {
        const files = req.files;
        const uploadedUrls = files.map((file) => file.path);
        const note = await noteModel.findOne({_id: req.params.id});
        note.notePicture.push(...uploadedUrls);
        await note.save();
        res.redirect('/api/note/read/'+req.params.id);
    } catch (error) {
        console.log(error);
        res.json({ message: "Error uploading images" });
    }
}

// Utility: Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${publicId}`;
};

module.exports = {  
    create,
    update,
    read,
    remove,
    index,
    addImages,
}
