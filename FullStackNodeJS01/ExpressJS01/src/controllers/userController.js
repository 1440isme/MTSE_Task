const User = require("../models/user");
const { createUserService, loginService, getUserService, updateMyProfileService } = require('../services/userService')

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

const getAccount = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const updateProfile = async (req, res) => {
    const data = await updateMyProfileService(req.user.email, req.body);
    return res.status(200).json(data);
}

module.exports = { createUser, handleLogin, getUser, getAccount, getProfile, updateProfile }