import User from '../models/user.model.js';
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
            user,
            success: true, 
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
             user,
             success: true,
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message: "Logout successful",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // here we will use cloudnary for links and files 


        let skillsArray;
        if (skills) {
            // Split the skills string into an array
            skillsArray = skills.split(',');
        };
        const userId = req.id; //Comes form middleware authentication

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found', success: false });
        }

        // Update the user profile only if the fields are provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        // the resume will come here leter 


        await user.save()

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        }


        return res.status(200).json({ 
            message: 'Profile updated successfully', 
            user,
            success: true 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
};