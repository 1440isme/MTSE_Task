require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_list = ["/", "/register", "/login"];
    if (white_list.find(item => '/v1/api' + item === req.originalUrl)) {
        next();

    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    createdBy: "tcb"
                }
                console.log(">>check token: ", decoded);
                next();

            } catch (error) {
                console.log("Error from: ", error);
                return res.status(400).json({ message: "Invalid token" });

            }

        } else {
            console.log("No token provided");
            return res.status(400).json({ message: "No token provided" });
        }

    }
}

module.exports = {
    auth
}