const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Message created', data: req.body });
});

router.get('/', (req, res) => {
  res.json({ message: 'Messages retrieved', data: [] });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Message ${id} deleted` });
});

module.exports = router;
