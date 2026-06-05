const mongoose = require('mongoose');

let dbInstance = null;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB is connected successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }
};

module.exports = {
  connectDB
};