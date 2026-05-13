const express = require('express');
const { handleLogin, getAccount, createUser } = require('../controllers/userController');
const { auth } = require("../middleware/auth");

const authRoutes = express.Router();

authRoutes.post("/login", handleLogin);
authRoutes.post("/register", createUser);
authRoutes.get("/me", auth, getAccount);

module.exports = authRoutes;
