const { verifyToken } = require('../utilities/auth');
const userModel = require('../models/userModel');


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).send('authorization required');

    try {
        const decoded = verifyToken(token);
        if(!decoded) return res.send({ message: 'invalid or expired token' });

        const user = await userModel.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(403).json({ message: 'Access denied. User is inactive or does not exist.' });
        }
        
        req.user = user;
        next();

    } catch (error) {
        res.status(500).send({
            message: 'Server error during authentication, error'
        })
    }
}

module.exports = authMiddleware;