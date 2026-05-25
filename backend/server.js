const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI (change with your actual credentials)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'portfolio';
const COLLECTION_NAME = 'lists';

let mongoClient;
let db;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory (frontend files)
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
async function connectDB() {
  try {
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    console.log(`✓ Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// API endpoint to handle contact form submissions
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create message document
    const messageDoc = {
      name,
      email,
      message,
      createdAt: new Date(),
      ipAddress: req.ip,
    };

    // Insert into MongoDB
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.insertOne(messageDoc);

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
