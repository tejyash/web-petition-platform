const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

router.post('/login', committeeController.login);
router.get('/logout', committeeController.logout);
router.get('/profile', committeeController.getProfile);

module.exports = router;