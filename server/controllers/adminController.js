// server/controllers/adminController.js
const Petition = require('../models/Petition');

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.send('Admin login successful!');
  } else {
    res.status(400).send('Invalid admin credentials.');
  }
};

exports.viewAllPetitions = async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Forbidden.');
  }
  try {
    const all = await Petition.getAllPetitions();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving petitions.');
  }
};

exports.closePetition = async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Forbidden.');
  }
  try {
    const { petition_id, responseText } = req.body;
    await Petition.closePetition(petition_id, responseText);
    res.send(`Petition #${petition_id} closed!`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error closing petition.');
  }
};