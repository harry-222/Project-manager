const express = require('express');
const projectRouter = express.Router();
const projectController = require('../controllers/project.controller.js');
const { verifyUser, ensureProjectOwner } = require('../middleware/user.middleware.js');
const { upload } = require('../middleware/fileupload.middleware.js');

projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/:id', projectController.getProjectById);
projectRouter.post('/', verifyUser, upload.single('image'), projectController.createProject);
projectRouter.put('/:id', verifyUser, ensureProjectOwner, upload.single('image'), projectController.updateProject);
projectRouter.delete('/:id', verifyUser, ensureProjectOwner, projectController.deleteProject);

module.exports = projectRouter;
