// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get leads for a specific manager for today
router.get('/lead/today/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  console.log(`Querying leads for today: ${today}, assignedSalesId: ${assignedSalesId}`); // Debugging line

  db.query(query, [today, assignedSalesId], (err, results) => {
    if (err) {
      console.error("Error querying leads:", err); // Log the error
      return res.status(500).json({ error: err.message });
    }
    console.log("Results:", results); // Log the results
    res.json({ count: results[0].count });
  });
});

// Get confirmed leads for a specific manager for today
router.get('/lead/confirmed/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'opportunity' AND DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  db.query(query, [today, assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get in-progress leads for a specific manager for today
router.get('/lead/in-progress/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'lead' AND DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  db.query(query, [today, assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get leads for a specific manager for yesterday
router.get('/lead/yesterday/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  db.query(query, [dateString, assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get confirmed leads for a specific manager for yesterday
router.get('/lead/confirmed/yesterday/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'opportunity' AND DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  db.query(query, [dateString, assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get in-progress leads for a specific manager for yesterday
router.get('/lead/in-progress/yesterday/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'lead' AND DATE(created_at) = ? AND assignedSalesId = ?
  `;
  
  db.query(query, [dateString, assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get count of leads with lead_type 'Meta Ads' for a specific manager
router.get('/lead/meta-ads/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE lead_type = 'Meta Ads' AND assignedSalesId = ?
  `;
  
  db.query(query, [assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get count of leads with lead_type not equal to 'Meta Ads' for a specific manager
router.get('/lead/not-meta-ads/:assignedSalesId', (req, res) => {
  const { assignedSalesId } = req.params;
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE lead_type != 'Meta Ads' AND assignedSalesId = ?
  `;
  
  db.query(query, [assignedSalesId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

module.exports = router;