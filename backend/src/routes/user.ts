import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/db.js";
import authmiddleware from "../middleware/auth.js";
const router = express.Router();
const JWT_SECRET = "supersecretkey123";

router.get("/user", authmiddleware, (req, res) => {
    res.json({ msg: "Hi, this is user route" });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ msg: "No user found" });
    }

    if (user.password !== password) {
        return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        msg: "Login successful",
        token
    });
});

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            msg: "User already exists"
        });
    }

    await User.create({ name, email, password });

    res.status(201).json({
        msg: "Signup successful"
    });
});

export default router;