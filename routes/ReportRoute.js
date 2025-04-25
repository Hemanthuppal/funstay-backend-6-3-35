// routes/reports.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all reports
// Get reports for a specific user
router.get('/api/users/:userId/reports', async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL
    
    const [rows] = await db.promise().query(
      'SELECT * FROM reports WHERE userId = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(rows.map(row => ({
      ...row,
      selectedFields: JSON.parse(row.selected_fields || '[]'), // Handle NULL cases
      activeFilters: JSON.parse(row.active_filters || '{}')
    })));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});
// Save a new report
router.post('/api/reports', async (req, res) => {
  const { name, description, selectedFields, activeFilters, userId } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Report name is required' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [result] = await db.promise().query(
      'INSERT INTO reports (name, description, selected_fields, active_filters, userId) VALUES (?, ?, ?, ?, ?)',
      [name, description, JSON.stringify(selectedFields), JSON.stringify(activeFilters), userId]
    );

    const [newReport] = await db.promise().query('SELECT * FROM reports WHERE id = ?', [result.insertId]);

    res.json({
      ...newReport[0],
      selectedFields: JSON.parse(newReport[0].selected_fields),
      activeFilters: JSON.parse(newReport[0].active_filters)
    });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Delete a report
router.delete('/api/reports/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query('DELETE FROM reports WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;
