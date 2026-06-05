const express = require('express');
const skillRouter = express.Router();
const skillController = require('../controllers/skill.controller');
const { verifyUser, ensureSkillOwner } = require('../middleware/skill.middleware');

skillRouter.get('/', skillController.getAllSkills);
skillRouter.post('/', verifyUser, skillController.createSkill);
skillRouter.put('/:id', verifyUser, ensureSkillOwner, skillController.updateSkill);
skillRouter.delete('/:id', verifyUser, ensureSkillOwner,  skillController.deleteSkill);
skillRouter.get('/my-skills', verifyUser, skillController.getAllMySkills);

module.exports = skillRouter;
