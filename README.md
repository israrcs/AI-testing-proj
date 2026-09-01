# Orbit Studio

A standalone Angular demo for a fictional digital studio brand. The app includes a dark, immersive landing page, a product showcase, a sign-in flow, and a signed-in dashboard section with a mocked session state.

## Project overview

This project is built with:
- Angular 20
- TypeScript
- Bootstrap utilities
- Custom CSS for the visual system and motion effects

## Requirements

- Node.js 20.19+ or 22.12+
- npm

Check your versions:

```bash
node -v
npm -v
```

## Run the project

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
