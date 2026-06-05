const express = require('express');
const skillRouter = express.Router();

skillRouter.get('/', (req, res) => {
  res.json({ message: 'GET /api/skills endpoint' });
});

skillRouter.post('/', (req, res) => {
  res.json({ message: 'POST /api/skills endpoint', data: req.body });
});

skillRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `PUT /api/skills/${id} endpoint`, id, data: req.body });
});

skillRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `DELETE /api/skills/${id} endpoint`, id });
});

module.exports = skillRouter;
