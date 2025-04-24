// server/controllers/petitionerController.js
const bcrypt = require('bcryptjs');
const Petitioner = require('../models/Petitioner');
const BioId = require('../models/BioID');

exports.registerPetitioner = async (req, res) => {
  try {
    const { email, fullname, dob, password, bioid } = req.body;

    // Check if bioid is valid
    const validBioid = await BioId.isValidBioId(bioid);
    if (!validBioid) {
      return res.status(400).send('Invalid or already-used BioID!');
    }

    // Check if email is taken
    const existing = await Petitioner.findByEmail(email);
    if (existing) {
      return res.status(400).send('Email already registered! Please login.');
    }

    // Hash password
    const hash = bcrypt.hashSync(password, 10);
    // Create user
    await Petitioner.createPetitioner(email, fullname, dob, hash, bioid);
    // Mark bioID used
    await BioId.setBioIdUsed(bioid);

    // Keep user logged in (session)
    req.session.userEmail = email;
    res.status(201).send('Registration successful! Login to continue.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering petitioner. Please try again.');
  }
};

exports.loginPetitioner = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await Petitioner.findByEmail(email);
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).send('Invalid email or password');
    }

    // Update last login timestamp
    await Petitioner.updateLastLogin(email);

    // Set session
    req.session.userEmail = user.petitioner_email;
    req.session.userId = user.petitioner_id;
    
    res.status(200).send('Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in.');
  }
};

exports.logoutPetitioner = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.clearCookie('connect.sid');
    res.send('Logged out!');
  });
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.status(401).send('Please login first.');
    }

    const user = await Petitioner.findByEmail(req.session.userEmail);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Only send necessary user info (avoid sending sensitive data)
    res.json({
      email: user.petitioner_email,
      fullname: user.fullname,
      dob: user.dob
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).send('Error fetching profile.');
  }
};