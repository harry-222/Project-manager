const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Message = require('../models/message.model');

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized: missing token' });

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: invalid token' });
        }

        const userId = payload.id || payload.userId || payload._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: invalid token payload' });

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized: invalid user' });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
};

const ensureMessageExists = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Message not found' });

        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        req.message = message;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating message', error: error.message });
    }
};

const ensureMessageOwner = async (req, res, next) => {
    try {
        if (req.message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Forbidden: not message owner'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error validating message owner',
            error: error.message
        });
    }
};

module.exports = {
    verifyUser,
    ensureMessageExists,
    ensureMessageOwner
};
