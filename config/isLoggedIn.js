const jwt = require("jsonwebtoken");
const cookieParse = require("cookie-parser")

function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") {
        res.redirect("login");
    } else {
        let data = jwt.verify(req.cookies.token, process.env.jwtSecret);
        req.user = data;
    }
    next();
}

module.exports = isLoggedIn;