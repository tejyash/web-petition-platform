## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Client Deployment](#client-deployment)
4. [Server Deployment](#server-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [File Structure](#file-structure)

---

## Overview

A secure, responsive platform enabling Shangri‑La citizens to propose, sign, and track parliamentary petitions—drawing inspiration from the UK Parliament’s petitions site.

Citizens register with a unique 10‑digit Biometric ID (BioID), scan its QR code or enter it manually for validation, then create or sign petitions.

A dedicated Committee Dashboard allows administrators to set signature thresholds, review petitions, publish parliamentary responses, and automatically close petitions once thresholds are met.

An open‑data REST API exposes all petition records and statuses to the public, media, and organizations.

---

## Technology Stack

**Frontend:**

- **Framework & Tooling:** React + Vite
- **Styling & UI:** TailwindCSS, Shadcn UI
- **Routing & Data:** React Router DOM, Axios
- **Animations:** Framer Motion
- **Quality:** ESLint

**Backend:**

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MySQL 8.0.35
- **Authentication & Security:** express-session, bcryptjs, cookie-parser, cors, dotenv
- **Utilities:** body-parser, nodemon

**Architecture & Dev Tools:**

- **MVC pattern** (controllers, models, routes, config)
- Environment configuration via .env
- Git for version control
- Development servers on ports 5173 (frontend) and 5001 (backend)

---

## Key Highlights & Achievements

**Civic-Tech Inspiration:** Modeled user flow and visual design on Gov.uk petitions, fostering intuitive citizen engagement.

**Biometric ID Verification:**

- Integrated QR-code scanning via webcam to auto-fill 10-digit BioIDs.
- Fallback manual entry with server-side validation against preloaded BioID records.
- Safeguards against duplicate BioID or email registrations.

**Robust Authentication:**

- Session-based login for "Petitioner" and "Committee" roles.
- Secure password hashing with bcryptjs and cookie management for "remember me" functionality.

**Dynamic User Dashboards:**

- **Petitioner:** Create petitions (immutable once posted), view live signature counts and statuses, sign any open petition (one signature per petition, non-revocable).
- **Committee:** Configure global signature thresholds; review and respond to qualifying petitions; automated status update to “closed” once answered.

**Open Data REST API:**

- Public endpoints (`GET /slpp/petitions[?status=open]`) return JSON payloads of all or filtered petitions, complete with IDs, titles, text, authors, signature counts and parliamentary responses.

**UX & Error Handling:**

- Responsive, mobile-first design with Tailwind utilities.
- Animated page transitions and feedback using Framer Motion.
- AJAX form-validation for real-time BioID/email/password checks.
- Clear error messages for invalid credentials, duplicate IDs, used QR codes, etc.

**Data Visualization & Extras:**

- Committee dashboard charts visualising signature progress (e.g., Chart.js integration).
- Cookie-based persisting of last-used username for faster login.
- Modular, environment-driven configuration for easy deployment.

---

## System Requirements

- **Node.js:** v18.17.0
- **npm:** v9.6.7
- **MySQL:** v8.0.35 (Server + Workbench)

---

## Client Deployment

1. **Navigate to the client folder**
   ```bash
   cd client
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the application**
   ```bash
   npm run dev
   ```
   - If it fails, build first: `npm run build`
4. **Troubleshooting**\
   If issues persist, install specific versions:
   ```bash
   npm install autoprefixer@10.4.20 axios@1.7.9 framer-motion@11.18.0 lucide-react@0.471.1 \
     postcss@8.5.1 react@18.3.1 react-dom@18.3.1 react-router-dom@7.1.1 \
     tailwindcss@3.4.17 @eslint/js@9.17.0 @shadcn/ui@0.0.4 @types/react@18.3.18 \
     @types/react-dom@18.3.5 @vitejs/plugin-react@4.3.4 eslint@9.17.0 \
     eslint-plugin-react@7.37.2 eslint-plugin-react-hooks@5.0.0 \
     eslint-plugin-react-refresh@0.4.16 globals@15.14.0 vite@6.0.5
   ```
5. **Access**\
   The client runs at: `http://localhost:5173`

---

## Server Deployment

1. **Navigate to the server folder**
   ```bash
   cd server
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the server**
   ```bash
   npm run dev
   ```
   (or `npm start`)
4. **Troubleshooting**\
   If issues persist, install specific versions:
   ```bash
   npm install bcryptjs@2.4.3 body-parser@1.20.3 cookie-parser@1.4.7 cors@2.8.5 dotenv@16.4.7 \
     express@4.21.2 express-session@1.18.1 mysql2@3.12.0 nodemon@3.1.9
   ```
5. **Access**\
   The server runs at: `http://localhost:5001`

---

## Environment Variables

Create a `.env` file in the **server** folder and add:

```ini
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
```

---

## Database Schema

The provided SQL file `cw2db.sql` contains the schema and initial data for the `cw2db` database.

---

## API Documentation

### 1. Authentication Endpoints

- **POST** `/petitioner/register`  : Register a new petitioner
- **POST** `/petitioner/login`     : Petitioner login
- **GET**  `/petitioner/logout`    : Petitioner logout
- **POST** `/committee/login`      : Committee login
- **GET**  `/committee/logout`     : Committee logout

### 2. Petition Endpoints

- **GET**  `/petition/all`          : Get all petitions
- **GET**  `/petition/my-petitions`: Get petitions of the authenticated user
- **POST** `/petition/create`       : Create a new petition
- **POST** `/petition/sign`         : Sign a petition
- **POST** `/petition/set-threshold`: Set petition threshold (committee only)
- **POST** `/petition/respond`      : Respond to a petition (committee only)

### 3. Open Data REST API (20%)

- **GET** `/slpp/petitions`  : Public API for petition data

  **Query Parameters:**
  - `status` : Filter by status (`open` / `closed` / `pending`)
  - `limit`  : Results per page
  - `page`   : Page number
  - `sort`   : Sort field

> For detailed request/response formats, see [OpenDataAPI.js](server/routes/OpenDataAPI.js).

---

## File Structure

### Client (`/client`)

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── auth-modal.jsx
│   │   ├── committee-auth-modal.jsx
│   │   ├── loading-screen.jsx
│   │   ├── petition-page.jsx
│   │   ├── petitioner-committee.jsx
│   │   ├── petitioner-dashboard.jsx
│   │   └── registration-page.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.js
└── vite.config.js
```

### Server (`/server`)

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── committeeController.js
│   ├── petitionController.js
│   └── petitionerController.js
├── models/
│   ├── BioID.js
│   ├── Petition.js
│   └── Petitioner.js
├── routes/
│   ├── adminRoutes.js
│   ├── committeeRoutes.js
│   ├── OpenDataAPI.js
│   ├── petitionerRoutes.js
│   └── petitionRoutes.js
├── .env
├── package.json
├── package-lock.json
├── server.js
└── SLPP-NODE.md
```

