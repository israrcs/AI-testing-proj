# Orbit Studio Backend - MongoDB + Express Authentication

This is the backend server for Orbit Studio that handles user authentication with MongoDB.

## Prerequisites

- Node.js 18+ (we're using 22.12.0)
- MongoDB (cloud or local)
- npm

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

You have two options:

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Copy it to the `.env` file (replace username and password)

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/orbit-studio` as your connection string

### 3. Create .env File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then update the values:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/orbit-studio?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

### 4. Start the Backend Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### Sign Up
- **POST** `/api/auth/signup`
- Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "title": "Product Lead" (optional)
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

#### Update Profile
- **PUT** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "fullName": "Jane Doe",
  "title": "Designer"
}
```

#### Health Check
- **GET** `/api/health`

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "token": "jwt-token-here", // Only for auth endpoints
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "title": "Product Lead",
    "avatar": "J"
  }
}
```

## Running Both Frontend and Backend

### Terminal 1 - Start Frontend
```bash
cd /home/israr/Desktop/repos/vs-code/first-AI-demo
npm start -- --host 0.0.0.0
```

### Terminal 2 - Start Backend
```bash
cd /home/israr/Desktop/repos/vs-code/first-AI-demo/server
npm start
```

Then visit `http://localhost:4200`

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed with bcryptjs),
  fullName: String,
  title: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

- Passwords are hashed using bcryptjs with salt rounds of 10
- JWT tokens expire in 7 days
- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting in production
- Add input validation and sanitization

## Troubleshooting

### MongoDB Connection Error
- Verify your connection string is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure network access is allowed

### CORS Error
- Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
- In development, use `http://localhost:4200`

### Port Already in Use
- Change the PORT in `.env` to an available port
- Or kill the process using the port: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
