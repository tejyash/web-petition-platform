// server/models/Petition.js
const pool = require('../config/db');

module.exports = {
  async createPetition(petitioner_email, title, content) {
    const sql = `
      INSERT INTO petitions
      (petitioner_email, title, content, status, response, signature_count)
      VALUES (?, ?, ?, 'open', '', 0)
    `;
    const [result] = await pool.query(sql, [petitioner_email, title, content]);
    return result.insertId;
  },

  async getAllPetitions(limit = 10, offset = 0, sort = 'petition_id') {
    const sql = `
      SELECT p.*, pt.fullname as petitioner_fullname 
      FROM petitions p
      JOIN petitioners pt ON p.petitioner_email = pt.petitioner_email
      ORDER BY ${sort}
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [limit, offset]);
    return rows;
  },

  async getPetitionsByStatus(status, limit = 10, offset = 0, sort = 'petition_id') {
    const sql = `
      SELECT * FROM petitions 
      WHERE status = ? 
      ORDER BY ${sort}
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [status, limit, offset]);
    return rows;
  },

  async incrementSignatureCount(petition_id) {
    const sql = `
      UPDATE petitions 
      SET signature_count = signature_count + 1
      WHERE petition_id = ?
    `;
    await pool.query(sql, [petition_id]);
  },

  async closePetition(petition_id, responseText) {
    const sql = `
      UPDATE petitions
      SET status = 'closed', response = ?
      WHERE petition_id = ?
    `;
    await pool.query(sql, [responseText, petition_id]);
  },

  async hasUserSigned(petition_id, petitioner_email) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM petition_signatures 
      WHERE petition_id = ? AND petitioner_email = ?
    `;
    const [rows] = await pool.query(sql, [petition_id, petitioner_email]);
    return rows[0].count > 0;
  },

  async addSignature(petition_id, petitioner_email) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if already signed
      const hasSigned = await this.hasUserSigned(petition_id, petitioner_email);
      if (hasSigned) {
        throw new Error('You have already signed this petition');
      }

      // Add signature record
      const signSql = `
        INSERT INTO petition_signatures (petition_id, petitioner_email)
        VALUES (?, ?)
      `;
      await connection.query(signSql, [petition_id, petitioner_email]);

      // Increment signature count
      const updateSql = `
        UPDATE petitions 
        SET signature_count = signature_count + 1
        WHERE petition_id = ?
      `;
      await connection.query(updateSql, [petition_id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getPetitionsByUser(email) {
    const sql = `
      SELECT p.*, pt.fullname as petitioner_fullname 
      FROM petitions p
      JOIN petitioners pt ON p.petitioner_email = pt.petitioner_email
      WHERE p.petitioner_email = ?
    `;
    const [rows] = await pool.query(sql, [email]);
    return rows;
  },

  async getTotalCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM petitions');
    return rows[0].count;
  },

  async getCountByStatus(status) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM petitions WHERE status = ?',
      [status]
    );
    return rows[0].count;
  }
};