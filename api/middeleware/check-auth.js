const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret Key");
        req.userData = decoded;
        next();

    } catch {
        return res.status(401).json({
            message: 'Auth Fild'
        });
    }
};