const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, 'H@nzala786');
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = {authenticateJWT};