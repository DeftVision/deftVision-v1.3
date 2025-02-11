const { generateToken } = require('../utilities/auth');
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const sgMail = require ("../config/sendgrid")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.newUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, location, isActive } = req.body
        if (!firstName || !lastName || !email || !password || !role || !location) {
            return res.status(400).send({
                message: 'missing required fields'
            })
        }
        const alreadyExist = await userModel.findOne({ email });
        if(alreadyExist){
            return res.status(409).send({
                message: 'email already used',
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({firstName, lastName, email, password: hashedPassword, role, location, isActive});
        await user.save();
        return res.status(201).send({
            message: 'user registered successfully',
            user,
        })

    } catch (error) {
        return res.status(500).send({
            message: 'registering user - server error',
            error: error.message || error,
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        console.log('🔹 Incoming PATCH request to update user');
        console.log('🔹 User ID:', req.params.id);
        console.log('🔹 Request Body:', req.body);

        const { firstName, lastName, role, isActive } = req.body;

        if (!firstName || !lastName || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, role, isActive },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ User updated successfully:', updatedUser);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating user:', error.message || error);
        res.status(500).json({ message: 'Server error while updating user', error: error.message || error });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if(!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        } else {
            return res.status(201).send({
                message: 'user deleted successfully',
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'deleting user by id - server error',
            error: error.message || error,
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        console.log("🔹 Users Retrieved from DB:", users.map(user => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        }))); // ✅ Log key user info

        return res.status(200).json({
            userCount: users.length,
            users,
        });
    } catch (error) {
        console.error("🔴 Error Fetching Users:", error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id);
        if(!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        } else {
            return res.status(200).send({
                user,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'get user by id - server error',
            error: error.message || error,
        })
    }
}

const Redis = require("ioredis");
const redis = new Redis(); // Redis must be initialized here


exports.login = async (req, res) => {
    try {
        console.log("🟢 Login request received:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            console.warn("⚠️ Missing email or password");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const cacheKey = `user:${email.toLowerCase()}`;

        // Check Redis cache first
        const cachedUser = await redis.get(cacheKey);
        if (cachedUser) {
            console.log("🟢 Returning cached user from Redis");
            return res.status(200).json(JSON.parse(cachedUser));
        }

        // Fetch user from MongoDB
        console.log("🔍 Searching for user in MongoDB...");
        const user = await userModel.findOne({ email: email.toLowerCase() }).select("+password role isActive");

        if (!user) {
            console.warn("❌ User not found:", email);
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.isActive) {
            console.warn("❌ User is inactive:", email);
            return res.status(403).json({ message: "Account inactive" });
        }

        console.log("🔐 Checking password...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn("❌ Incorrect password attempt:", email);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("🔑 Generating token...");
        const token = generateToken({ id: user._id, role: user.role });

        // Store user in Redis (expires in 1 hour)
        console.log("📝 Storing user in Redis cache...");
        const responsePayload = { message: "Login successful", token, user: { id: user._id, role: user.role, email: user.email }};
        await redis.setex(cacheKey, 3600, JSON.stringify(responsePayload));

        console.log("✅ Login successful:", email);
        return res.status(200).json(responsePayload);

    } catch (error) {
        console.error("❌ Login error:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email) {
            return res.status(400).send({
                message: 'email is required'
            })
        }
        const user = await userModel.findOne({ email })
        if(!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        }

        const resetToken = generateToken(user._id);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://localhost:8005/api/user/reset-password/${resetToken}`;

        const msg = {
            to: email,
            from: 'support@deftvision.com',
            subject: 'password reset request',
            text: 'please use the following link to reset your password:',
            html: `<strong>Please use the following link to reset your password:</strong><a href="${resetLink}">${resetLink}</a>`
        }

        sgMail
            .send(msg)
            .then(() => {
                res.status(201).send({
                    message: 'Password reset email sent successfully'
                })
            });
    } catch (error) {
        res.status(500).send({
            message: 'sending forgot password email - server error',
            error: error.message || error
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if(!newPassword) {
            return res.status(400).send({
                message: 'missing required fields'
            })
        }

        if(!user) {
            return res.status(401).send({
                message: 'Invalid or expired token'
            })
        }

        user.password = await bcrypt.hash(newPassword, 14);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

    } catch (error) {
        res.status(500).send({
            message: 'resetting password - server error',
            error: error.message || error
        })
    }
}

// TODO: end point doesn't work
exports.toggleActiveStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {isActive} = req.body;
        const user = userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        } else {
            return res.status(201).send({
                message: 'user updated successfully',
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'updating user status - server error',
            error: error.message || error,
        })
    }
}


