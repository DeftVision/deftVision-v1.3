const jwt = require('jsonwebtoken');

// Accept a payload object directly
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};


const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token successfully verified:', decoded);
        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};


module.exports = { generateToken, verifyToken };