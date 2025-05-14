import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

//create router 
const router = express.Router();

//route to get user data for the frontend with token
router.get('/', auth, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await User.findById(userId);
        return res.status(200).json(userData);
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
});


//Register a new User
router.post('/register', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});


router.post('/enable-mfa', auth, async(req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally, re-verify the user's password before enabling MFA
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const secret = speakeasy.generateSecret({
            length: 20, // Adjust length as needed
            name: `YourAppName:${user.username}`, // Displayed in the authenticator app
        });

        user.mfaSecret = secret.base32; // Store the base32 encoded secret
        user.isMFAEnabled = true;
        await user.save();

        // Generate QR code data URL
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).json({ message: 'Failed to generate QR code' });
            }
            res.json({ secret: secret.base32, qrCodeUrl: data_url });
        });
    } catch (error) {
        console.error('Error enabling MFA:', error);
        res.status(500).json({ message: 'Failed to enable MFA' });
    }
});

router.post('/disable-mfa', auth, async(req, res) => {
    try {
        const { password } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        user.isMFAEnabled = false;
        user.mfaSecret = null;
        await user.save();

        res.json({ message: 'MFA disabled successfully' });
    } catch (error) {
        console.error('Error disabling MFA:', error);
        res.status(500).json({ message: 'Failed to disable MFA' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { username, password, mfaToken } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.isMFAEnabled) {
            if (!mfaToken) {
                return res.status(401).json({ message: 'MFA token required' });
            }

            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaToken,
                window: 1, // Allow a window of +/- 1 step (30 seconds each) for clock drift
            });

            if (!verified) {
                return res.status(401).json({ message: 'Invalid MFA token' });
            }
        }

        // If MFA is not enabled or the token is valid, proceed with session creation
        // ... your session management logic (e.g., JWT) ...
        const token = jwt.sign({ id: user._id, password: user.password }, process.env.JWT_SECRET); // Replace with your actual token generation
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

export default router;