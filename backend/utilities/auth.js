const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
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