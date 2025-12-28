const express = require("express");
const userModel = require("../models/user-model");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");


const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // 1. Validate input
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already has an account" });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user
        const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
        });

        // 5. Generate token
        const token = generateToken(user);

        // 6. Send response
        return res.status(201).json({
            message: "User created successfully",
            token,
            user,
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async function (req, res) {
    try {

        let { email, password } = req.body;

        let user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(409).json({ message: "Email or Password incorrect" });
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,        // true in production (HTTPS)
                    sameSite: "lax",      // important for localhost
                });

                return res.status(200).json({
                    message: "You are logged In",
                    user,
                });
            } else {
                return res.status(409).json({
                    message: "Email and Password incorrect",
                });
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const logoutUser = function (req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,        // true in production (HTTPS)
        sameSite: "lax",      // important for localhost
    });
    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { registerUser, loginUser, logoutUser }