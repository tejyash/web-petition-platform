// server/routes/petitionerRoutes.js
const express = require('express');
const router = express.Router();
const petitionerController = require('../controllers/petitionerController');

router.options('/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

router.post('/register', petitionerController.registerPetitioner);
router.post('/login', petitionerController.loginPetitioner);
router.get('/logout', petitionerController.logoutPetitioner);
router.get('/profile', petitionerController.getProfile);

module.exports = router;