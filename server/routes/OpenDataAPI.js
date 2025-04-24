// server/routes/openDataAPI.js
const express = require('express');
const router = express.Router();
const Petition = require('../models/Petition');

// Validate status parameter
const validateStatus = (status) => {
  const validStatuses = ['open', 'closed', 'pending'];
  return validStatuses.includes(status);
};

// GET /slpp/petitions
// Query parameters:
// - status: Filter by petition status (open, closed, pending)
// - limit: Number of results per page (default: 10)
// - page: Page number (default: 1)
// - sort: Sort by field (default: petition_id)
router.get('/petitions', async (req, res) => {
  try {
    let { status, limit = 10, page = 1, sort = 'petition_id' } = req.query;
    
    // Validate status if provided
    if (status && !validateStatus(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: open, closed, pending' 
      });
    }

    // Convert to numbers
    limit = parseInt(limit);
    page = parseInt(page);

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        error: 'Invalid limit. Must be between 1 and 100' 
      });
    }
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ 
        error: 'Invalid page. Must be greater than 0' 
      });
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get data
    let data;
    if (status) {
      data = await Petition.getPetitionsByStatus(status, limit, offset, sort);
    } else {
      data = await Petition.getAllPetitions(limit, offset, sort);
    }

    // Get total count for pagination
    const totalCount = status ? 
      await Petition.getCountByStatus(status) : 
      await Petition.getTotalCount();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Format response
    const responseBody = {
      metadata: {
        total_count: totalCount,
        page_count: totalPages,
        current_page: page,
        per_page: limit
      },
      petitions: data.map(item => ({
        petition_id: item.petition_id.toString(),
        status: item.status,
        petition_title: item.title,
        petition_text: item.content,
        petitioner: item.petitioner_email,
        signatures: item.signature_count ? item.signature_count.toString() : '0',
        response: item.response || ''
      }))
    };

    res.json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Server error',
      message: err.message 
    });
  }
});

module.exports = router;