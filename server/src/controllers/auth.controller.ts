import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

async function registerUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPass });
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            username: newUser.username
        }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // required for cross-site cookie settings on most modern browsers/environments when dealing with different domains
            sameSite: "none", // necessary for cross-origin if frontend/backend are on different domains
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            token: token, message: "User registered successfully", user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
}


async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            token: token, message: "User logged in successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export { registerUser, login };