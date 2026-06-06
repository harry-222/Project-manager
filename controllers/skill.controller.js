const Skill = require('../models/skill.model');
const mongoose = require('mongoose');
const { ApplicationError } = require('../middleware/error.middleware.js');

class SkillController {
    getAllSkills = async (req, res) => {
        try {
            const skills = await Skill.find();
            res.json(skills);
        } catch (err) {
            throw new ApplicationError(err.message || 'Server error', 500);
        }
    }

    getAllMySkills = async (req, res) => {
        try {
            const skills = await Skill.find({ owner: req.user._id });
            res.json(skills);
        } catch (err) {
            throw new ApplicationError(err.message || 'Server error', 500);
        }
    }

    createSkill = async (req, res) => {
        try {
            const skill = new Skill({ ...req.body, owner: req.user._id });
            await skill.save();
            res.status(201).json(skill);
        } catch (err) {
            throw new ApplicationError(err.message || 'Server error', 500);
        }
    }

    updateSkill = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Check if id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError('Skill not found', 404);
            }
            
            const skill = await Skill.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!skill) {
                throw new ApplicationError('Skill not found', 404);
            }

            res.json(skill);
        } catch (err) {
            throw new ApplicationError(err.message || 'Server error', 500);
        }
    }

    deleteSkill = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Check if id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ApplicationError('Skill not found', 404);
            }
            
            const skill = await Skill.findByIdAndDelete(id);

            if (!skill) {
                throw new ApplicationError('Skill not found', 404);
            }

            res.json({ message: 'Skill deleted', skill });
        } catch (err) {
            throw new ApplicationError(err.message || 'Server error', 500);
        }
    }

}

module.exports = new SkillController();