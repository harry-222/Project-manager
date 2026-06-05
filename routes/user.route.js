const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', (req, res) => {
  res.send('POST /api/auth/register endpoint is created');
});

userRouter.post('/login', (req, res) => {
  res.send('POST /api/auth/login endpoint is created');
});

module.exports = userRouter;
