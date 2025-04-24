SLPP Documentation

Table of Contents
1. Overview
2. System Requirements
3. Client Deployment
4. Server Deployment
5. API Documentation
6. File Structure

Overview

SLPP is a full-stack web application built with:
1. Frontend: React + Vite, TailwindCSS, Framer Motion
2. Backend: Node.js, Express.js, MySQL
3. Authentication: User Login & Registration -- Session-based with cookie management.

System Requirements

Node.js v18.17.0
npm v9.6.7
MySQL v8.0.35 - I used MySQL Server + MySQL Workbench


--------------------------------

Client Deployment

1. Navigate to client folder
cd client (PLEASE DO THIS AS ROOT FOLDER HAS TWO SEPARATE FOLDERS -- CLIENT & SERVER)

2. Install dependencies
npm install or look into the package.json file for installing each individual package.

3. Run the application (if doesn't run then build it first)

npm run dev (I prefer, and works on this project) or npm run build

5. If all above doesn't work, try this hack:

npm install autoprefixer@10.4.20 axios@1.7.9 framer-motion@11.18.0 lucide-react@0.471.1 postcss@8.5.1 react@18.3.1 react-dom@18.3.1 react-router-dom@7.1.1 tailwindcss@3.4.17 @eslint/js@9.17.0 @shadcn/ui@0.0.4 @types/react@18.3.18 @types/react-dom@18.3.5 @vitejs/plugin-react@4.3.4 eslint@9.17.0 eslint-plugin-react@7.37.2 eslint-plugin-react-hooks@5.0.0 eslint-plugin-react-refresh@0.4.16 globals@15.14.0 vite@6.0.5

The client will run on http://localhost:5173 by default.(vite.js Default) AND I have optimised it for it, please don't change it.

--------------------------------

Server Deployment

1. Navigate to server folder
cd server (PLEASE DO THIS AS ROOT FOLDER HAS TWO SEPARATE FOLDERS -- CLIENT & SERVER)

2. Install dependencies
npm install or look into the package.json (dependencies & devDependencies) file for installing each individual package.

3. Start the server
I prefer: npm run dev (but you can use npm start)

4. If nothing works, try this HACK:
npm install bcryptjs@2.4.3 body-parser@1.20.3 cookie-parser@1.4.7 cors@2.8.5 dotenv@16.4.7 express@4.21.2 express-session@1.18.1 mysql2@3.12.0 nodemon@3.1.9

The server will run on http://localhost:5001 by default AND I have optimised it for it, please don't change it.

--------------------------------

Environment Variables

Use the provided .env file only PLEASE.Create an .env file in your folder and paste the below code:
# server/.env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=cw2db
PORT=5001
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=somesecretstring

# Admin defaults
ADMIN_EMAIL=admin@petition.parliament.sr
ADMIN_PASSWORD=2025%shangrila

---------------------------------

The sql file with the db -- cw2db.sql is provided alongside!

---------------------------------

API Documentation

- The API provides several endpoints for managing petitions and users:

1. Authentication Endpoints

POST /petitioner/register: Register new petitioner
POST /petitioner/login: Petitioner login
GET /petitioner/logout: Petitioner logout
POST /committee/login: Committee login
GET /committee/logout: Committee logout

2. Petition Endpoints

GET /petition/all: Get all petitions
GET /petition/my-petitions: Get user's petitions
POST /petition/create: Create new petition
POST /petition/sign: Sign a petition
POST /petition/set-threshold: Set petition threshold (committee only)
POST /petition/respond: Respond to petition (committee only)

3. Open Data REST API Implementation (20%)

GET /slpp/petitions: Public API for petition data

Query parameters:
- status: Filter by status (open/closed/pending)
- limit: Results per page
- page: Page number
- sort: Sort field

For detailed API callouts and request/response formats, refer to the OpenDataAPI.js file in slpp-node/server/routes/OpenDataAPI.js

---------------------------------

File Structure

1. SLPP-NODE/Client:

└── 📁client
    └── 📁public
        └── vite.svg
    └── 📁src
        └── App.jsx
        └── 📁assets
            └── react.svg
        └── Client-Folder-structure.md
        └── 📁components
            └── auth-model.jsx
            └── committee-auth-modal.jsx
            └── loading-screen.jsx
            └── petition-page.jsx
            └── petitioner-commitee.jsx
            └── petitioner-dashboard.jsx
            └── registration-page.jsx
        └── index.css
        └── main.jsx
    └── .gitignore
    └── eslint.config.js
    └── index.html
    └── package-lock.json
    └── package.json
    └── postcss.config.cjs
    └── tailwind.config.js
    └── vite.config.js

2. SLPP-NODE/Server:

└── 📁server
    └── 📁config
        └── db.js
    └── 📁controllers
        └── adminController.js
        └── committeeController.js
        └── petitionController.js
        └── petitionerController.js
    └── 📁models
        └── BioID.js
        └── Petition.js
        └── Petitioner.js
    └── 📁routes
        └── adminRoutes.js
        └── committeeRoutes.js
        └── OpenDataAPI.js
        └── petitionerRoutes.js
        └── petitionRoutes.js
    └── .DS_Store
    └── .env
    └── package-lock.json
    └── package.json
    └── server.js
    └── SLPP-NODE.md

---------------------------------