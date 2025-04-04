import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Ensure all required fields are provided
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Verify if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                error: 'User already exists', 
                success: false 
            });
        }

        // Encrypt the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({ 
            fullname, 
            email, 
            phoneNumber, 
            password: encryptedPassword, 
            role 
        });
        await user.save();

        return res.status(201).json({ 
            message: 'Registration successful', 
            user 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        const user = await User.findOne({ email});
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials', 
                success: false 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid credentials', 
                success: false 
            });
        }
        if (user.role !== role) {
            return res.status(403).json({ 
            error: 'Mentioned role is invalid', 
            success: false 
            });
        }
        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1d',
        });
        req.user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        };
        return res.status(200).cookie('token', token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true, samesite:'strict'}).json({
             message: `Welcome back ${user.fullname}`,
             success: true,
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};