const { verifyToken } = require('../utilities/auth');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).send('authorization required');

    const decoded = verifyToken(token);
    if(!decoded) return res.send({ message: 'invalid or expired token' });

    req.user = await decoded;
    next();
}

module.exports = authMiddleware;