const { generateToken } = require('../utilities/auth');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.newUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, location, isActive } = req.body
        if (!firstName || !lastName || !email || !password || !role || !location) {
            return res.send({
                message: 'all fields are required'
            })
        }
        const alreadyExist = await userModel.findOne({ email });
        if(alreadyExist){
            return res.send({
                message: 'email already used',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 14);


        const user = new userModel({firstName, lastName, email, password: hashedPassword, role, location, isActive});
        await user.save();
        return res.send({
            message: 'user registered successfully',
            user,
        })

    } catch (error) {
        console.log('user wasn\'t registered', error);
        return res.send({
            message: 'failed to register user'
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const { firstName, lastName, email, password, location, role, isActive } = req.body;
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!user){
            return res.send({
                message: 'user not found'
            })
        }
        return res.send({
            message: 'user updated successfully',
            user,
        })
    } catch (error) {
        console.log('failed to update user', error)
        return res.send({
            message: 'failed to update user'
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if(!user) {
            return res.send({
                message: 'user not found'
            })
        } else {
            return res.send({
                message: 'user deleted successfully',
            })
        }
    } catch (error) {
        console.error('deleting user didn\'t go as planned', error)
        return res.send({
            message: 'failed to delete user'
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});

        if (!users) return res.send('No users');
        return res.send({
            userCount: users.length,
            users,
        })

    } catch (error) {
        return res.send({
            message: 'failed to get users',
            error: error,
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id);
        if(!user) {
            return res.send({
                message: 'user not found'
            })
        } else {
            return res.send({
                user,
            })
        }
    } catch (error) {
        console.error('user not updated', error);
        return res.send({
            message: 'failed to get user',
            error: error,
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send({
                message: '2 fields are required'
            })
        }


        const user = await userModel.findOne({ email })
        if (!user) {
            return res.send({
                message: 'error finding user'
            })
        }

        if (!user.isActive) {
            return res.send({
                message: 'this account is inactive, contact your administrator'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.send({
                message: 'error logging in - check credentials',
            })
        }
        const token = generateToken(user._id);

        return res.send({
            message: 'user is logged in',
            token,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.send({
            message: "server error", error
        })

    }
}


exports.toggleActiveStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {isActive} = req.body;
        const user = userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!user) {
            return res.send({
                message: 'user not found'
            })
        } else {
            console.log('user updated successfully')
        }
    } catch (error) {
        console.error('failed getting user data', error)
        return res.send({
            message: 'couldn\'t find user data',
            error: error,
        })
    }
}


