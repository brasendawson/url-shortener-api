import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../utils/tokenBlacklist.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ message: 'Token has been invalidated, Log in Again' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};