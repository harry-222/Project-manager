const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const { ApplicationError } = require('./error.middleware.js');

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) throw new ApplicationError('Unauthorized: missing token', 401);

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        } catch (err) {
            throw new ApplicationError('Unauthorized: invalid token', 401);
        }

        const userId = payload.id || payload.userId || payload._id;
        if (!userId) throw new ApplicationError('Unauthorized: invalid token payload', 401);

        const user = await User.findById(userId);
        if (!user) throw new ApplicationError('Unauthorized: invalid user', 401);

        req.user = user;
        next();
    } catch (error) {
        throw new ApplicationError(error.message, 500);
    }
};

const ensureMessageExists = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) throw new ApplicationError('Message not found', 404);

        const message = await Message.findById(id);
        if (!message) throw new ApplicationError('Message not found', 404);

        req.message = message;
        next();
    } catch (error) {
        throw new ApplicationError(error.message || 'Error validating message', 500);
    }
};

const ensureMessageOwner = async (req, res, next) => {
    try {
        if (req.message.sender.toString() !== req.user._id.toString()) {
            throw new ApplicationError('Forbidden: not message owner', 403);
        }

        next();
    } catch (error) {
        throw new ApplicationError(error.message || 'Error validating message owner', 500);
    }
};

module.exports = {
    verifyUser,
    ensureMessageExists,
    ensureMessageOwner
};
