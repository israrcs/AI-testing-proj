# Database & Authentication Setup Guide

This guide will help you set up the MongoDB database and test the authentication system.

## Quick Start

### Step 1: Set Up MongoDB

Choose one option below:

#### Option A: MongoDB Atlas (Cloud - Recommended for beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create a free account
4. Create a new project (name it "Orbit Studio")
5. Create a new cluster (M0 Shared - Free tier)
6. Wait for cluster to deploy (2-5 minutes)
7. Click "Connect"
8. Choose "Drivers"
9. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority`)
10. Replace `<password>` with your actual password

#### Option B: Local MongoDB

1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Windows
   # Run "MongoDB Server" from Services
   
   # Linux
   sudo systemctl start mongod
   ```
3. Connection string: `mongodb://localhost:27017/orbit-studio`

### Step 2: Configure Environment Variables

1. Update `server/.env` with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/orbit-studio?retryWrites=true&w=majority
JWT_SECRET=orbit-studio-secret-key-change-in-production
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

### Step 3: Start the Backend Server

```bash
cd server
npm start
```

You should see:
```
🚀 Orbit Studio Backend running on port 3000
📡 CORS origin: http://localhost:4200
✓ MongoDB connected successfully
```

### Step 4: Start the Frontend

In another terminal:

```bash
npm start -- --host 0.0.0.0
```

Visit `http://localhost:4200`

### Step 5: Test Authentication

#### Create an Account
1. Click "Sign up"
2. Enter:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Sign Up"
4. You should be redirected to the Dashboard

#### Try Signing In Again
1. Click "Sign in"
2. Enter the same email and password
3. Click "Sign In"
4. You should be logged in to the dashboard

#### View the User in MongoDB

Open MongoDB Atlas or MongoDB Compass:
1. Go to your cluster
2. Navigate to: `orbit-studio` database → `users` collection
3. You should see your user document with:
   - Email
   - Hashed password
   - Full name
   - Title
   - Avatar

## Testing the API with Postman or curl

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "title": "Designer"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

This returns a token:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "newuser@example.com",
    "fullName": "John Doe",
    "title": "Designer",
    "avatar": "J"
  }
}
```

### Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>" \
  -d '{
    "fullName": "Jane Doe",
    "title": "Product Lead"
  }'
```

## Troubleshooting

### "Failed to connect to database"
- Check your MongoDB connection string in `.env`
- Make sure MongoDB is running
- Check network access (if using MongoDB Atlas, whitelist your IP)

### "Port 3000 is already in use"
- Change PORT in `.env` to a different port (e.g., 3001)
- Or kill the process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### "Invalid credentials" during login
- Make sure you created the account with sign-up first
- Check that email and password are exactly correct
- Passwords are case-sensitive

### "CORS error"
- Make sure backend is running on port 3000
- Check `CORS_ORIGIN` in `.env` matches your frontend URL
- Make sure frontend is running on the specified port

## Database Structure

When you sign up, the following data is stored in MongoDB:

```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  password: "$2a$10$...", // Hashed with bcryptjs
  fullName: "John Doe",
  title: "Designer",
  avatar: "J",
  createdAt: ISODate("2026-09-01T14:30:00.000Z"),
  updatedAt: ISODate("2026-09-01T14:30:00.000Z")
}
```

## Security Features

✓ Passwords are hashed with bcryptjs (10 salt rounds)
✓ JWT tokens expire in 7 days
✓ CORS enabled for frontend only
✓ Protected routes require valid token
✓ Input validation on signup/login

## Next Steps

1. Try creating multiple accounts
2. Sign in/out with different accounts
3. Update your profile information
4. Check your user data in MongoDB

## Need Help?

Check the server logs:
```bash
cd server
npm start  # Shows detailed logs
```

Look at API responses in browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Try signing up/logging in
4. Click the API request to see response details
