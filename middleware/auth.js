const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
    let token;
    if ( req.cookies['o-auth-token'] === undefined )
        token = req.header('o-auth-token');
    else    token = req.cookies['o-auth-token'];
    if (!token) return res.status(401).send('Access denied. No token provided.');
    
    try {
        const decoded = jwt.verify(token, 'notUsingConfigVariables');
        req.user = decoded;
        next();
    }
    catch {
        res.status(400).send('invalid user');
    }
}