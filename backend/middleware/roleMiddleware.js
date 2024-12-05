const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const { user } = req;
        if(!user || user.role !== requiredRole) {
            return res.status(403).send({
                message: 'Access denied. Insufficient permissions'
            })
        }
        next();
    }
}

module.exports = roleMiddleware;