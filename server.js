const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const userRoutes = require('./routes/user.route.js');
const projectRoutes = require('./routes/project.route.js');
const skillRoutes = require('./routes/skill.route.js');
const messageRoutes = require('./routes/message.route.js');
const { connectDB } = require('./config/mongo.config.js');
const { infoLogger, errorLogger, ApplicationError } = require('./middleware/error.middleware.js');

dotenv.config({ quiet: true });

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('API is running successfully');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.on('finish', () => {
    infoLogger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).send(`API not found. Please check our documentation for more information at localhost:${PORT}/api-docs`);
});

app.use((err, req, res, next) => {
  console.error("Error caught by error handler:", err.message);
  errorLogger.error(`${req.method} ${req.originalUrl} ${err.message}`);
  if (err instanceof ApplicationError && err.statusCode < 500) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
  await connectDB();
});