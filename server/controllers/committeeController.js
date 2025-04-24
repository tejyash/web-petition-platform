const pool = require('../config/db');
require('dotenv').config();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the provided credentials match the admin commitee credentials from .env file 
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Set session data for committee officer
            req.session.isCommitteeOfficer = true;
            req.session.userEmail = email;
            
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    email: email,
                    fullname: 'Committee Officer'
                }
            });
        } else {
            // If credentials don't match, return error
            // Don't specify which field is incorrect for security
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Committee login error:', error);
        res.status(500).json({
            message: 'An error occurred during login'
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: 'Error logging out'
            });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({
            message: 'Logged out successfully'
        });
    });
};

exports.getProfile = (req, res) => {
    // Check if user is logged in as committee officer
    if (!req.session.isCommitteeOfficer) {
        return res.status(401).json({
            message: 'Not authorized'
        });
    }

    res.json({
        email: req.session.userEmail,
        fullname: 'Committee Officer'
    });
};

// Middleware to check if user is a committee officer
exports.isCommitteeOfficer = (req, res, next) => {
    if (!req.session.isCommitteeOfficer) {
        return res.status(401).json({
            message: 'Access denied. Committee officers only.'
        });
    }
    next();
};