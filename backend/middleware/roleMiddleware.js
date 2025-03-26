const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const { user } = req;
        if(!user || !allowedRoles.includes(user.role)) {
            return res.status(403).send({
                message: 'Access denied. Insufficient permissions'
            })
        }
        next();
    }
}

module.exports = roleMiddleware;