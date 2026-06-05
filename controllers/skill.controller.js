const Skill = require('../models/skill.model');
const mongoose = require('mongoose');

class SkillController {
    getAllSkills = async (req, res) => {
        try {
            const skills = await Skill.find();
            res.json(skills);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

    getAllMySkills = async (req, res) => {
        try {
            const skills = await Skill.find({ owner: req.user._id });
            res.json(skills);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

    createSkill = async (req, res) => {
        try {
            const skill = new Skill({ ...req.body, owner: req.user._id });
            await skill.save();
            res.status(201).json(skill);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

    updateSkill = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Check if id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            
            const skill = await Skill.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            res.json(skill);
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

    deleteSkill = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Check if id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            
            const skill = await Skill.findByIdAndDelete(id);

            if (!skill) {
                return res.status(404).json({ error: 'Skill not found' });
            }

            res.json({ message: 'Skill deleted', skill });
        } catch (err) {
            res.status(500).json({ error: 'Server error', details: err.message });
        }
    }

}

module.exports = new SkillController();