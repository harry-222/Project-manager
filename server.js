const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user.route.js');
const projectRoutes = require('./routes/project.route.js');
const skillRoutes = require('./routes/skill.route.js');
const messageRoutes = require('./routes/message.route.js');
const { connectDB } = require('./config/mongo.config.js');

dotenv.config({ quiet: true });

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('API is running successfully');
});

app.use('/api/auth', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
  connectDB();
});