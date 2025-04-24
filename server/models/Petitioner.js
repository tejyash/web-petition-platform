// server/models/Petitioner.js
const pool = require('../config/db');

module.exports = {
  async findByEmail(email) {
    const sql = `SELECT * FROM petitioners WHERE petitioner_email = ?`;
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
  },

  async createPetitioner(email, fullname, dob, password_hash, bioid) {
    const sql = `
      INSERT INTO petitioners 
      (petitioner_email, fullname, dob, password_hash, bioid)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [email, fullname, dob, password_hash, bioid]);
  },

  async updateLastLogin(email) {
    const sql = `
      UPDATE petitioners 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE petitioner_email = ?
    `;
    await pool.query(sql, [email]);
  }
};