// server/models/BioId.js
const pool = require('../config/db');

module.exports = {
  async isValidBioId(code) {
    const sql = `SELECT * FROM bioid WHERE code = ? AND used = 0`;
    const [rows] = await pool.query(sql, [code]);
    return rows.length > 0;
  },

  async setBioIdUsed(code) {
    const sql = `UPDATE bioid SET used = 1 WHERE code = ?`;
    await pool.query(sql, [code]);
  }
};