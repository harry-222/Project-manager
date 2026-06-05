const express = require('express');
const projectRouter = express.Router();

projectRouter.get('/', (req, res) => {
  res.json({ message: 'GET all projects' });
});

projectRouter.get('/:id', (req, res) => {
  res.json({ message: `GET project ${req.params.id}` });
});

projectRouter.post('/', (req, res) => {
  res.json({ message: 'POST create project' });
});

projectRouter.put('/:id', (req, res) => {
  res.json({ message: `PUT update project ${req.params.id}` });
});

projectRouter.delete('/:id', (req, res) => {
  res.json({ message: `DELETE project ${req.params.id}` });
});

module.exports = projectRouter;
