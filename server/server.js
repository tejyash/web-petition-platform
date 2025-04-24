// server/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/db');

const petitionerRoutes = require('./routes/petitionerRoutes');
const petitionRoutes = require('./routes/petitionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const openDataApi = require('./routes/OpenDataAPI');
const committeeRoutes = require('./routes/committeeRoutes');
const app = express();

// Move CORS middleware to top
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'randomSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true
    }
  })
);

// Add this test connection
pool.query('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to SLPP, Server up and running!!');
});

// Routes
app.use('/petitioner', petitionerRoutes);
app.use('/petition', petitionRoutes);
app.use('/admin', adminRoutes);
app.use('/slpp', openDataApi);
app.use('/committee', committeeRoutes);
// Start server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});