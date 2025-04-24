// server/routes/petitionRoutes.js
const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/petitionController');
const committeeController = require('../controllers/committeeController');

router.post('/create', petitionController.createPetition);
router.post('/sign', petitionController.signPetition);
router.get('/all', petitionController.viewAllPetitions);
router.get('/my-petitions', petitionController.getMyPetitions);
router.post('/set-threshold', 
  committeeController.isCommitteeOfficer,
  petitionController.setThreshold
);
router.post('/respond', 
  committeeController.isCommitteeOfficer,
  petitionController.respondToPetition
);

module.exports = router;