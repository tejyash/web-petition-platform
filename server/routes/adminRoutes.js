// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.loginAdmin);
router.get('/all', adminController.viewAllPetitions);
router.post('/close', adminController.closePetition);

module.exports = router;