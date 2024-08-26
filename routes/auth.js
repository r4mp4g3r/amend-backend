const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User'); 
const sendEmail = require('../utils/sendEmail');

// Route to request password reset
router.post('/request-reset-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://yourfrontend.com/reset-password/${token}`;

    await sendEmail(user.email, 'Password Reset Request', `
        Please click on the following link to reset your password:
        ${resetLink}
    `);

    res.json({ message: 'Password reset link sent to your email.' });
});

// Route to reset the password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword; // Hash the password here if needed
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password successfully reset.' });
});
module.exports = router;