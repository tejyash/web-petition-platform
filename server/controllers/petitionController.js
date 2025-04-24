// server/controllers/petitionController.js
const Petition = require('../models/Petition');
const pool = require('../config/db');

exports.createPetition = async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.status(401).send('Please login first.');
    }
    const { title, content } = req.body;
    const petitioner_email = req.session.userEmail;

    const newId = await Petition.createPetition(petitioner_email, title, content);
    res.status(201).send(`Petition created with ID: ${newId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating petition.');
  }
};

exports.signPetition = async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.status(401).send('Please login first.');
    }
    const { petition_id } = req.body;
    const petitioner_email = req.session.userEmail;

    try {
      await Petition.addSignature(petition_id, petitioner_email);
      res.send(`Signed petition #${petition_id}!`);
    } catch (err) {
      if (err.message === 'You have already signed this petition') {
        return res.status(400).send(err.message);
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error signing petition.');
  }
};

exports.viewAllPetitions = async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.status(401).send('Please login first.');
    }

    const petitions = await Petition.getAllPetitions();
    
    // Add hasUserSigned field to each petition
    const petitionsWithSignStatus = await Promise.all(
      petitions.map(async (petition) => {
        const hasSigned = await Petition.hasUserSigned(
          petition.petition_id,
          req.session.userEmail
        );
        return { ...petition, hasUserSigned: hasSigned };
      })
    );

    res.json(petitionsWithSignStatus);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving petitions.');
  }
};

exports.getMyPetitions = async (req, res) => {
  try {
    if (!req.session.userEmail) {
      return res.status(401).send('Please login first.');
    }

    const petitions = await Petition.getPetitionsByUser(req.session.userEmail);
    
    // Add hasUserSigned field to each petition
    const petitionsWithSignStatus = await Promise.all(
      petitions.map(async (petition) => {
        const hasSigned = await Petition.hasUserSigned(
          petition.petition_id,
          req.session.userEmail
        );
        return { ...petition, hasUserSigned: hasSigned };
      })
    );

    res.json(petitionsWithSignStatus);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving petitions.');
  }
};

exports.setThreshold = async (req, res) => {
  const { petition_id, threshold } = req.body;

  try {
    // Add some validation
    if (!petition_id || !threshold) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await pool.execute(
      'UPDATE petitions SET threshold = ? WHERE petition_id = ?',
      [threshold, petition_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.json({ 
      message: 'Threshold set successfully',
      threshold: threshold
    });
  } catch (error) {
    console.error('Error setting threshold:', error);
    res.status(500).json({ message: 'Error setting threshold' });
  }
};

exports.respondToPetition = async (req, res) => {
  const { petition_id, response } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE petitions SET committee_response = ?, status = "closed" WHERE petition_id = ?',
      [response, petition_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    res.json({ message: 'Response submitted successfully' });
  } catch (error) {
    console.error('Error responding to petition:', error);
    res.status(500).json({ message: 'Error responding to petition' });
  }
};