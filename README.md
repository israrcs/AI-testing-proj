# Orbit Studio

A standalone Angular demo for a fictional digital studio brand with user authentication. The app includes a dark, immersive landing page, a product showcase, a sign-in flow, and a signed-in dashboard section with real MongoDB-backed user data.

## Project overview

This project is built with:
- Angular 20 (Frontend)
- TypeScript
- Bootstrap utilities
- Custom CSS for the visual system and motion effects
- Node.js + Express (Backend)
- MongoDB (Database)
- JWT Authentication

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB (local or MongoDB Atlas cloud account)

Check your versions:

```bash
node -v
npm -v
```

## Setup & Run

### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start -- --host 0.0.0.0
```

3. Open the app in your browser:

```text
http://localhost:4200
```

If port 4200 is already busy, Angular will usually choose the next available port, or you can set a different port manually:

```bash
npx ng serve --host 0.0.0.0 --port 4201
```

### Backend Setup

The backend provides user authentication with MongoDB storage.

1. Navigate to the server directory:

```bash
cd server
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure MongoDB:

**Option A: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env`

**Option B: Local MongoDB**
- Ensure MongoDB is installed and running locally
- Use `mongodb://localhost:27017/orbit-studio` as the connection string

5. Start the backend server:

```bash
npm start
```

The server runs on `http://localhost:3000` by default.

For development with auto-reload:

```bash
npm run dev
```

### Running Frontend + Backend Together

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm start -- --host 0.0.0.0
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
```

Then visit `http://localhost:4200`

## Authentication Flow

1. Click "Sign in" or "Sign up" on the landing page
2. Enter your credentials (new account for sign-up, or existing account for login)
3. The app sends credentials to the backend API
4. Backend verifies credentials against MongoDB
5. On success, a JWT token is returned and stored locally
6. You're redirected to the dashboard
7. Future requests include the token in the Authorization header

## API Endpoints

All authentication endpoints are prefixed with `/api/auth`:

- `POST /signup` - Create a new account
- `POST /login` - Login with existing credentials
- `GET /me` - Fetch current user profile
- `PUT /profile` - Update user profile
- `GET /health` - Health check

See [server/README.md](server/README.md) for detailed API documentation.

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Build for production

```bash
npm run build
```

## Project flow

### 1. Home page
- Hero section with large brand statement
- Product cards and interactive product details
- Company and contact sections

### 2. Sign-in and sign-up flow
- User clicks Sign in or Sign up from the header
- A modal opens with account mode switching
- Demo credentials are available for quick testing:
  - Email: test@orbit.studio
  - Password: orbit123

### 3. Session state
- Successful sign-in stores the session in localStorage
- The user session is restored on page reload
- Sign-out clears the saved session

### 4. Dashboard section
- Once signed in, the dashboard becomes visible
- The dashboard includes:
  - project summary cards
  - recent activity
  - active project tracking
- The dashboard can be opened directly via the signed-in menu

## Main app structure

```text
src/
  app/
    app.component.ts
    app.component.html
    app.component.css
  main.ts
  styles.css
```

### Core logic
- `app.component.ts` manages:
  - product state
  - auth modal state
  - sign-in and sign-up logic
  - session persistence with localStorage
  - dashboard route-like scrolling behavior

### UI structure
- `app.component.html` contains the full landing page and dashboard layout
- `app.component.css` contains the Orbit Studio design system, responsive styling, and motion effects

## Useful commands

```bash
npm start -- --host 0.0.0.0
npm run build
npm run watch
```

## Notes

- This is a front-end demo and does not connect to a real backend
- Authentication is mocked with local demo credentials
- The project is intended for design/demo work and rapid prototyping

## Local Git push workflow

If this project is not already linked to a remote repository, initialize it and push it to GitHub with:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Replace `<your-github-repo-url>` with your GitHub repository URL.
