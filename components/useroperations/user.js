const login = async (req, res) => {
    try {
        res.json({message:"Login successful"});
    } catch (error) {
        console.log(error);
    }
    
}

const register = async (req, res) => {  
    try {  
        res.json({message:"Register successful"}); 
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
