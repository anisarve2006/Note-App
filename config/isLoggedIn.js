const jwt = require("jsonwebtoken");
const cookieParse = require("cookie-parser")
function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        const data = jwt.verify(token, process.env.jwtSecret); // Decodes the token
        req.user = data; // Attaches user info to `req.user`
        next(); // Proceeds to the next middleware/route
    } catch (error) {
        console.error("Authentication error:", error);
        return res.redirect("/login"); // Redirects if token is invalid
    }
}

module.exports = isLoggedIn;