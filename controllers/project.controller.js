const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');

class ProjectController {

    async getAllProjects(req, res) {
        try {
            const projects = await Project.find().populate('owner', 'username email');
            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching projects', error: error.message });
        }
    }

    async getProjectById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            const project = await Project.findById(id)
                .populate('owner', 'username email');

            if (!project) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            return res.json(project);

        } catch (error) {
            return res.status(500).json({
                message: 'Error fetching project',
                error: error.message
            });
        }
    }

    async createProject (req, res) {
        try {
            const projectData = { ...req.body, owner: req.user._id };
            const project = new Project(projectData);
            await project.save();
            res.status(201).json(project);
        } catch (error) {
            res.status(500).json({ message: 'Error creating project', error: error.message });
        }
    }

    async updateProject (req, res) {
        try {
            const updates = { ...req.body };
            delete updates.owner;
            delete updates._id;

            const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, {
                new: true,
                runValidators: true,
            });

            res.json(updatedProject);
        } catch (error) {
            res.status(500).json({ message: 'Error updating project', error: error.message });
        }
    }

    async deleteProject (req, res) {
        try {
            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting project', error: error.message });
        }
    }
}

module.exports = new ProjectController();
