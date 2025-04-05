import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization'];
    
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Login first.', success: false });
        }

        // ✅ Minimal fix to support both header and cookie
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token.', success: false });
        }

        req.id = decoded.userId || decoded.id; // In case your token uses 'id' instead of 'userId'
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

export default isAuthenticated;
