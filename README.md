# Portfolio Backend Setup Guide

## Overview
This portfolio now includes a Node.js/Express backend that stores contact form messages in MongoDB.

## Prerequisites
- Node.js (v14+) and npm installed
- MongoDB installed locally OR MongoDB Atlas account

## Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
If you have MongoDB running locally on the default port (27017), the `.env` file is already configured.

#### Option B: MongoDB Atlas (Cloud)
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `backend/.env` file:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
PORT=3000
```

### 3. Start the Server
```bash
cd backend
npm start
```

The server will run on `http://localhost:3000`

## How It Works

- **Database:** `portfolio`
- **Collection:** `list`
- **API Endpoint:** `POST /api/messages`

### Message Structure
Each contact form submission is stored with:
- `name` - Visitor's name
- `email` - Visitor's email
- `message` - Contact message
- `createdAt` - Timestamp
- `ipAddress` - Visitor's IP address

## Testing the API

You can test the API using curl:
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Hello from API"
  }'
```

## Viewing Messages in MongoDB

### Using MongoDB Compass:
1. Connect to your MongoDB instance
2. Navigate to `portfolio` database
3. View the `list` collection

### Using MongoDB Shell:
```bash
mongosh "your-connection-uri"
use portfolio
db.list.find().pretty()
```

## Troubleshooting

- **Connection Error:** Ensure MongoDB is running or Atlas credentials are correct
- **Port Already in Use:** Change `PORT` in `.env` file
- **CORS Error:** The server allows cross-origin requests from the frontend

## Project Structure
```
PORTFOLIO/        # Frontend HTML
├── styles.css                  # Frontend Styling
├── script.js                   # Frontend JavaScript
├── resume.txt                  # Resume file
├── SETUP.md                    # Setup guide
│
└── backend/
    ├── server.js               # Express backend server
    ├── package.json            # Backend dependencies
    └── .env                    # Backend configurationon
└── resume.txt          # Resume file
```
