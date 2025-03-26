const { verifyToken } = require('../utilities/auth');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization header:', authHeader); // Log the authorization header
    console.log('Extracted token:', token); // Log the extracted token

    if (!token) {
        console.error('Token missing from Authorization header');
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = verifyToken(token); // Decodes and verifies the token
        console.log('Decoded token:', decoded); // Log the decoded token

        if (!decoded) {
            console.error('Invalid or expired token');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Fetch the user from the database
        const user = await userModel.findById(decoded.id);
        console.log('Fetched user from database:', user);

        if (!user) {
            console.error('User not found in database');
            return res.status(404).json({ message: 'User does not exist' });
        }

        if (!user.isActive) {
            console.error('Inactive user attempted access');
            return res.status(403).json({ message: 'Access denied. User is inactive.' });
        }

        req.user = { id: user._id.toString(), role: user.role, fullName: `${user.firstName} ${user.lastName}` }; // Attach user info to the request
        console.log('Authenticated user:', req.user); // Log the authenticated user

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            message: 'Server error during authentication',
            error: error.message,
        });
    }
};

module.exports = authMiddleware;
