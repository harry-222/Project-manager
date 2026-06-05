const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

let dbInstance = null;
let uri = process.env.MONGO_URI || 'mongodb://localhost:27017/projectmanager';

async function connectDB() {
    if (!uri) {
        throw new Error('MongoDB connection URI is required');
    }

    if (dbInstance) {
        return dbInstance;
    }

    try {
        const connection = await MongoClient.connect(uri);

        console.log('Connected to MongoDB successfully');
        
        dbInstance = connection.db(); 
        return dbInstance;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

function getDB() {
    if (!dbInstance) {
        throw new Error('Database is not connected. Call connectDB first.');
    }
    return dbInstance;
}

module.exports = {
    connectDB,
    getDB,
};
