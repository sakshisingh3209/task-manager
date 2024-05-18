const jwt = require('jsonwebtoken');

const jwtAuthMiddleWare = (req, res, next) => {

    //first check request header has authorization or not
    const authorization = req.headers.authorization
    if (!authorization) return res.status(401).json({ error: 'Token not found' });

    //Extract the token from the header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user information to the req object
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid token' });

    }
}
const generateToken = (userData) => {

    //Generate a new token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
}

module.exports = {
    jwtAuthMiddleWare,
    generateToken
}