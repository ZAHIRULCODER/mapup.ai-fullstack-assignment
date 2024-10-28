import express from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		const { username, password, role } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword, role });
		await user.save();
		res.status(201).json({ message: "User created" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;
