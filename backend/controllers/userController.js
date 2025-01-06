const { generateToken } = require('../utilities/auth');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
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
        const hashedPassword = await bcrypt.hash(password, 14);

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
        const {id} = req.params;
        const { firstName, lastName, email, password, location, role, isActive } = req.body;
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!user){
            return res.status(400).send({
                message: 'user not found'
            })
        }
        return res.status(201).send({
            message: 'user updated successfully',
            user,
        })
    } catch (error) {
        return res.status(500).send({
            message: 'updating user by id - server error',
            error: error.message || error,
        })
    }
}

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
        if (!users) return res.status(400).send('No users');
        return res.status(200).send({
            userCount: users.length,
            users,
        })
    } catch (error) {
        return res.status(500).send({
            message: 'getting users -  server error',
            error: error.message || error,
        })
    }
}

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                message: 'missing required fields'
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({
                message: 'user not found'
            })
        }

        if (!user.isActive) {
            return res.status(403).send({
                message: 'this account is inactive, contact your administrator'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).send({
                message: 'error logging in - check credentials',
            })
        }
        const token = generateToken({
            id: user._id,
            role: user.role,
            location: user.location || 'unknown location',
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        return res.status(201).send({
            message: 'user logged in successfully',
            token,
            user: { id: user._id, role: user.role, email: user.email, location: user.location, firstName: user.firstName, lastName: user.lastName }
        })
    } catch (error) {
        return res.status(500).send({
            message: "logging in - server error", error
        })
    }
}

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


