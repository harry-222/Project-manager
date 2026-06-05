const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Skill = require('../models/skill.model');

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: missing token' });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        } catch (verifyError) {
            console.log(verifyError);
            return res.status(401).json({ message: 'Unauthorized: invalid token' });
        }

        const userId = payload.id || payload.userId || payload._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: invalid token payload' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: invalid user' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error: error.message });
    }
};

const ensureSkillOwner = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: 'Skill not found'
            });
        }
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (!skill.owner || skill.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: not skill owner' });
        }

        req.skill = skill;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating skill owner', error: error.message });
    }
};

module.exports = {
    verifyUser,
    ensureSkillOwner
};