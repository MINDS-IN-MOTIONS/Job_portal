import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization'];
    
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
        }
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.', success: false });
        }
        // Check if the token is expired
        req.id = decoded.userId;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export default isAuthenticated; 