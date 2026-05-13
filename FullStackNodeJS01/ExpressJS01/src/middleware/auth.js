require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                email: decoded.email,
                name: decoded.name,
                createdBy: "tcb"
            }
            next();
        } catch (error) {
            console.log("Error from: ", error);
            return res.status(401).json({ message: "Invalid token" });
        }
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
}

module.exports = {
    auth
}