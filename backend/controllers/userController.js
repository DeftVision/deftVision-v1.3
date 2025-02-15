// backend/controllers/userController.js

const { generateToken } = require('../utilities/auth');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const sgMail = require("../config/sendgrid");
const Redis = require("ioredis");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const redis = new Redis(); // Initialize Redis

// ✅ Register a New User
exports.newUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, location, isActive } = req.body;
        if (!firstName || !lastName || !email || !password || !role || !location) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        const alreadyExist = await userModel.findOne({ email });
        if (alreadyExist) {
            return res.status(409).send({ message: 'Email already used' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ firstName, lastName, email, password: hashedPassword, role, location, isActive });
        await user.save();

        return res.status(201).send({ message: 'User registered successfully', user });

    } catch (error) {
        return res.status(500).send({ message: 'Registering user - server error', error: error.message || error });
    }
};

// ✅ Update a User
exports.updateUser = async (req, res) => {
    try {
        console.log('🔹 Updating user:', req.params.id);
        const { firstName, lastName, role, isActive } = req.body;

        if (!firstName || !lastName || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, role, isActive },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        console.log('✅ User updated:', updatedUser);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message || error });
    }
};

// ✅ Delete a User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) return res.status(400).send({ message: 'User not found' });

        return res.status(201).send({ message: 'User deleted successfully' });

    } catch (error) {
        return res.status(500).send({ message: 'Deleting user - server error', error: error.message || error });
    }
};

// ✅ Get All Users
exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        console.log("🔹 Users Retrieved:", users.map(user => ({
            id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role, isActive: user.isActive
        })));

        return res.status(200).json({ userCount: users.length, users });

    } catch (error) {
        console.error("🔴 Error Fetching Users:", error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Get a Single User by ID
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) return res.status(400).send({ message: 'User not found' });

        return res.status(200).send({ user });

    } catch (error) {
        return res.status(500).send({ message: 'Get user by ID - server error', error: error.message || error });
    }
};

// ✅ User Login with Redis Caching
exports.login = async (req, res) => {
    try {
        console.log("🟢 Login request received:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            console.warn("⚠️ Missing email or password");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const cacheKey = `user:${email.toLowerCase()}`;

        // 🔍 Check Redis Cache First
        const cachedUser = await redis.get(cacheKey);
        if (cachedUser) {
            console.log("🟢 Returning cached user from Redis");
            return res.status(200).json(JSON.parse(cachedUser));
        }

        // 🔍 Fetch from MongoDB
        console.log("🔍 Searching for user in MongoDB...");
        const user = await userModel.findOne({ email: email.toLowerCase() }).select("+password role isActive");

        if (!user) return res.status(400).json({ message: "User not found" });
        if (!user.isActive) return res.status(403).json({ message: "Account inactive" });

        console.log("🔐 Checking password...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        console.log("🔑 Generating token...");
        const token = generateToken({ id: user._id, role: user.role });

        // 📝 Store User in Redis Cache
        const responsePayload = { message: "Login successful", token, user: { id: user._id, role: user.role, email: user.email } };
        await redis.setex(cacheKey, 3600, JSON.stringify(responsePayload));

        console.log("✅ Login successful:", email);
        return res.status(200).json(responsePayload);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Forgot Password (Sends Email)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ message: 'Email is required' });

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send({ message: 'User not found' });

        const resetToken = generateToken(user._id);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `${process.env.REACT_APP_API_URL}/user/reset-password/${resetToken}`;
        const msg = {
            to: email, from: 'support@deftvision.com', subject: 'Password Reset Request',
            html: `<strong>Please use this link to reset your password:</strong> <a href="${resetLink}">${resetLink}</a>`
        };

        sgMail.send(msg).then(() => res.status(201).send({ message: 'Password reset email sent successfully' }));

    } catch (error) {
        res.status(500).send({ message: 'Sending forgot password email - server error', error: error.message || error });
    }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!newPassword || !user) return res.status(400).send({ message: 'Invalid or expired token' });

        user.password = await bcrypt.hash(newPassword, 14);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

    } catch (error) {
        res.status(500).send({ message: 'Resetting password - server error', error: error.message || error });
    }
};
