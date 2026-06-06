const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const { ApplicationError } = require('./error.middleware.js');

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            throw new ApplicationError('Unauthorized: missing token', 401);
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        } catch (verifyError) {
            console.log(verifyError);
            throw new ApplicationError('Unauthorized: invalid token', 401);
        }
        
        const userId = payload.id || payload.userId || payload._id;
        if (!userId) {
            throw new ApplicationError('Unauthorized: invalid token payload', 401);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApplicationError('Unauthorized: invalid user', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApplicationError(error.message, 500);
    }
}

const ensureProjectOwner = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new ApplicationError('Project not found', 404);
        }
        const project = await Project.findById(req.params.id);
        if (!project) {
            throw new ApplicationError('Project not found', 404);
        }

        if (!project.owner || project.owner.toString() !== req.user._id.toString()) {
            throw new ApplicationError('Forbidden: not project owner', 403);
        }

        req.project = project;
        next();
    } catch (error) {
        throw new ApplicationError(error.message, 500);
    }
}

module.exports = {
    verifyUser,
    ensureProjectOwner
};