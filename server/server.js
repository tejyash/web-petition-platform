// server/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./config/db');
const config = require('./config/config');

const petitionerRoutes = require('./routes/petitionerRoutes');
const petitionRoutes = require('./routes/petitionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const openDataApi = require('./routes/OpenDataAPI');
const committeeRoutes = require('./routes/committeeRoutes');
const app = express();

// Move CORS middleware to top
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.CORS.ORIGINS.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
    secret: config.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.SESSION.COOKIE.SECURE,
      sameSite: config.SESSION.COOKIE.SAME_SITE,
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
const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});