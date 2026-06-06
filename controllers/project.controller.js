const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const { ApplicationError } = require('../middleware/error.middleware.js');

class ProjectController {

    async getAllProjects(req, res) {
        try {
            const projects = await Project.find().populate('owner', 'username email');
            res.json(projects);
        } catch (error) {
            throw new ApplicationError(error.message || 'Error fetching projects', 500);
        }
    }

    async getProjectById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError("Invalid project ID", 400);
            }

            const project = await Project.findById(id)
                .populate('owner', 'username email');

            if (!project) {
                throw new ApplicationError("Project not found", 404);
            }

            return res.json(project);

        } catch (error) {
            throw new ApplicationError(error.message || 'Error fetching project', 500);
        }
    }

    async createProject (req, res) {
        try {
            const projectData = { ...req.body, owner: req.user._id, image: req.file ? req.file.path : undefined };
            const project = new Project(projectData);
            await project.save();
            res.status(201).json(project);
        } catch (error) {
            throw new ApplicationError(error.message || 'Error creating project', 500);
        }
    }

    async updateProject (req, res) {
        try {
            const updates = { ...req.body };
            delete updates.owner;
            delete updates._id;

            if (req.file) {
                updates.image = req.file ? req.file.path : undefined;
            }

            const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, {
                new: true,
                runValidators: true,
            });

            if (!updatedProject) {
                throw new ApplicationError("Project not found", 404);
            }

            res.json(updatedProject);
        } catch (error) {
            throw new ApplicationError(error.message || 'Error updating project', 500);
        }
    }

    async deleteProject (req, res) {
        try {
            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project deleted' });
        } catch (error) {
            throw new ApplicationError(error.message || 'Error deleting project', 500);
        }
    }
}

module.exports = new ProjectController();
