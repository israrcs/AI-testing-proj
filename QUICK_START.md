# Quick Reference Guide

## 🚀 Get Started in 3 Steps

### Step 1: MongoDB Setup (Choose one)

**Cloud Option (MongoDB Atlas):**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Copy connection string
4. Update server/.env with MONGODB_URI
```

**Local Option:**
```
1. Install MongoDB
2. Start MongoDB service
3. Use: mongodb://localhost:27017/orbit-studio
```

### Step 2: Start Backend
```bash
cd server
npm start
```
Server runs on `http://localhost:3000`

### Step 3: Start Frontend (New Terminal)
```bash
npm start -- --host 0.0.0.0
```
App opens at `http://localhost:4200`

---

## 📋 Key Files & What They Do

| File | Purpose |
|------|---------|
| `server/server.js` | Express backend server |
| `server/models/User.js` | MongoDB user schema |
| `server/routes/auth.js` | Login/Signup endpoints |
| `server/.env` | Database credentials |
| `src/app/services/auth.service.ts` | Frontend auth service |
| `src/app/app.component.ts` | Main app component |

---

## 🔐 Authentication Flow

```
User Sign Up
    ↓
[Frontend] → POST /api/auth/signup → [Backend]
    ↓                                    ↓
    ← JWT Token + User Data ← Hash password + Save to MongoDB
    ↓
Store token + Redirect to dashboard
```

---

## 🧪 Test It Out

1. **Sign Up**: New email, password, full name
2. **Sign In**: Use same credentials
3. **Dashboard**: View your account info
4. **MongoDB**: Check data in database

---

## 📚 Documentation

- **Setup Details** → `AUTHENTICATION_SETUP.md`
- **Full Implementation** → `DATABASE_IMPLEMENTATION.md`
- **Backend API** → `server/README.md`
- **Main Project** → `README.md`

---

## 🛠️ Common Commands

```bash
# Frontend
npm install          # Install dependencies
npm start           # Start dev server
npm run build       # Build for production

# Backend
cd server
npm install         # Install dependencies
npm start          # Start server
npm run dev        # Start with auto-reload

# Database
mongo              # Connect to MongoDB (if local)
```

---

## ⚡ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to MongoDB" | Check `.env` connection string |
| "Port already in use" | Change PORT in `server/.env` |
| "CORS error" | Ensure both servers running |
| "Invalid credentials" | Create account via sign-up first |

---

## 🔑 API Endpoints

```
POST   /api/auth/signup      → Create account
POST   /api/auth/login       → Login
GET    /api/auth/me          → Get profile (with token)
PUT    /api/auth/profile     → Update profile (with token)
GET    /api/health           → Server status
```

---

## 📦 Tech Stack

- **Frontend**: Angular 20 + TypeScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **Style**: Custom CSS + Bootstrap

---

## 🎯 What's New

✅ User registration with validation
✅ Secure password hashing
✅ JWT token authentication
✅ MongoDB database integration
✅ Protected API endpoints
✅ Session persistence
✅ Dashboard access control

---

## 📞 Need Help?

1. Check the documentation files
2. Look at error messages in browser console (F12)
3. Check server logs in terminal
4. Verify `.env` configuration
5. Ensure both frontend and backend are running

---

**You're all set! Start by running the backend and frontend in separate terminals.** 🎉
