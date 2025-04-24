# Deployment Guide

This guide will help you deploy the web petition platform with:
- Frontend on GitHub Pages (free)
- Backend on Heroku (or Railway, Render, etc.)

## Frontend Deployment (GitHub Pages)

### Prerequisites
- GitHub account
- Git installed on your computer

### Steps

1. **Push your code to GitHub**
   
   If you haven't already, create a GitHub repository and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/web-petition-platform.git
   git push -u origin main
   ```

2. **Configure GitHub Pages**

   - Go to your GitHub repository
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "GitHub Actions"
   - This will use the workflow file we've already created at `.github/workflows/deploy.yml`

3. **Update Configuration with Your GitHub Username**

   - In `client/vite.config.js`, ensure the base path matches your repository name
   - In `client/src/config.js`, update the backend URL to point to your deployed backend
   - In `server/config/config.js`, update the FRONTEND_URL to your GitHub Pages URL

4. **Push Changes and Wait for Deployment**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push
   ```

5. **Check Deployment Status**
   - Go to the "Actions" tab in your GitHub repository
   - You should see a workflow running. Once it completes, your site will be available at:
     `https://yourusername.github.io/web-petition-platform/`

## Backend Deployment (Heroku)

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a Heroku App**
   ```bash
   cd server
   heroku create your-petition-app-backend
   ```

3. **Add a MySQL Database**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

4. **Get Database Credentials**
   ```bash
   heroku config:get JAWSDB_URL
   ```
   - Parse the URL to get host, username, password, and database name 
   - Format: `mysql://username:password@hostname:port/database_name`

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your_secret_string
   heroku config:set FRONTEND_URL=https://yourusername.github.io/web-petition-platform
   ```

6. **Deploy the Backend**
   ```bash
   git subtree push --prefix server heroku main
   ```
   
   If you get an error, you can force push:
   ```bash
   git subtree split --prefix server -b deploy-backend
   git push -f heroku deploy-backend:main
   git branch -D deploy-backend
   ```

7. **Run Database Migrations**
   - You'll need to import your schema to the JawsDB MySQL database
   - Use a MySQL client or the Heroku CLI to connect to your database and run your SQL script

8. **Test the Backend**
   ```bash
   heroku open
   ```

## Alternative Backend Deployment Options

### Railway.app (Free tier available)

1. Sign up for Railway.app
2. Connect your GitHub repository
3. Create a new project from your repository
4. Add a MySQL database plugin 
5. Set up environment variables
6. Deploy

### Render.com (Free tier available)

1. Sign up for Render.com
2. Connect your GitHub repository
3. Create a new Web Service, select your repository
4. For the "Build Command", use: `cd server && npm install`
5. For the "Start Command", use: `cd server && node server.js`
6. Add a MySQL database from Render's dashboard
7. Set up environment variables
8. Deploy

## Updating Your Deployment

### Frontend
- Simply push changes to your GitHub repository:
  ```bash
  git add .
  git commit -m "Your changes"
  git push
  ```
- The GitHub Actions workflow will automatically rebuild and deploy your site

### Backend
- For Heroku, push changes to your backend:
  ```bash
  git subtree push --prefix server heroku main
  ```
- For Railway or Render, pushing to your GitHub repository should trigger automatic deployments 