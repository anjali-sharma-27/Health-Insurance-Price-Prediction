import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modals/user.models.js"

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Signup input:", { username, email, password });

    try {
        if (!username || !email || !password) return res.status(400).json({ error: "Please fill in all fields" });

        if (password.trim().length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        const createdUser = await User.findById(newUser._id).select("-password");

        if (createdUser) {
            console.log(process.env.JWT_SECRET_KEY, "process.env.JWT_SECRET_KEY")
            const token = await jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "7d",
            });

            if (!token) {
                return res.status(500).json({ error: "Failed to generate token" });
            }

            res
                .status(201)
                .cookie("jwtToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                })
                .json({
                    message: "User created successfully",
                    user: {
                        _id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                    },
                });
        } else {
            res.status(500).json({ message: "Unable to create user." })
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: err.message || "Signup failed" });
    }
};

// Login

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res
            .status(200)
            .cookie("jwtToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};