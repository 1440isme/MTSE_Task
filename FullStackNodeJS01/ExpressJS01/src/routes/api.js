const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { auth } = require("../middleware/auth");
const delay = require("../middleware/delay");

const apiRoutes = express.Router();
apiRoutes.use(auth);
apiRoutes.get("/", (req, res) => {
    res.send("Hello World from API");
})
apiRoutes.post("/register", createUser)
apiRoutes.post("/login", handleLogin)
apiRoutes.get("/user", getUser)
apiRoutes.get("/account", delay, getAccount)
module.exports = apiRoutes;
