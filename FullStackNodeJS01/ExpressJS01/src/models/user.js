const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "USER"
    },
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    gender: Boolean,
    avatar: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
module.exports = User;