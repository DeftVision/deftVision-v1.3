const { verifyToken } = require('../utilities/auth');
const userModel = require('../models/userModel');


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('authorization header:', authHeader);
    console.log('extracted token:', token);

    if(!token) return res.status(401).send('authorization required');

    try {
        const decoded = verifyToken(token);
        console.log('decoded token: ', decoded)
        if(!decoded) return res.status(401).send({ message: 'invalid or expired token' });

        const user = await userModel.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(403).send({ message: 'Access denied. User is inactive or does not exist.' });
        }
        
        req.user = { id: user._id, role: decoded.role };
        console.log('authenticated user: ', req.user);
        next();

    } catch (error) {
        console.log('authenticated middleware error:', error);
        res.status(500).send({ message: 'Server error during authentication', error})
    }
}

module.exports = authMiddleware;