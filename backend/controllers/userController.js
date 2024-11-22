
const { generateToken } = require('../utilities/auth');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')



exports.newUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
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


        const user = new userModel({name, email, password: hashedPassword});
        await user.save();
        return res.send({
            message: 'user registered successfully',
            user: { name, email }
        })

    } catch (error) {
        console.log(error);
        return res.send({
            message: 'failed to register user',
            error: error
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, email, password } = req.body;
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!user){
            return res.send({
                message: 'user not found'
            })
        }
        return res.send({})
    } catch (error) {

    }
}

exports.deleteUser = async (req, res) => {
    try {

    } catch (error) {

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

    } catch (error) {

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


