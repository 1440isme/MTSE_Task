require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return { message: "User already exists", EC: 1 };
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            userName: name,
            email,
            password: hashPassword,
            role: "USER"
        });
        await newUser.save();
        return { message: "User created successfully", EC: 0 };
    } catch (error) {
        console.log("createUserService Error: ", error);
        return { error: error.message };
    }
}
const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password is incorrect"
                }
            } else {
                const payload = {
                    email: user.email,
                    name: user.name
                }
                const accessToken = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    user: {
                        email: user.email,
                        name: user.name
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password is incorrect"
            }
        }

    } catch (error) {
        console.log("loginService Error: ", error);
        return { error: error.message };
    }
}
const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return null;

    }
}
module.exports = {
    createUserService, loginService, getUserService
}