// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get leads for a specific manager for today
router.get('/leads/today/:managerid', (req, res) => {
  const { managerid } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [today, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get confirmed leads for a specific manager for today
router.get('/leads/confirmed/:managerid', (req, res) => {
  const { managerid } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'opportunity' AND DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [today, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get in-progress leads for a specific manager for today
router.get('/leads/in-progress/:managerid', (req, res) => {
  const { managerid } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'lead' AND DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [today, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get leads for a specific manager for yesterday
router.get('/leads/yesterday/:managerid', (req, res) => {
  const { managerid } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [dateString, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get confirmed leads for a specific manager for yesterday
router.get('/leads/confirmed/yesterday/:managerid', (req, res) => {
  const { managerid } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'opportunity' AND DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [dateString, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get in-progress leads for a specific manager for yesterday
router.get('/leads/in-progress/yesterday/:managerid', (req, res) => {
  const { managerid } = req.params;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateString = yesterday.toISOString().split('T')[0];
  
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'lead' AND DATE(created_at) = ? AND managerid = ?
  `;
  
  db.query(query, [dateString, managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get count of leads with lead_type 'Meta Ads' for a specific manager
router.get('/leads/meta-ads/:managerid', (req, res) => {
  const { managerid } = req.params;
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE lead_type = 'Meta Ads' AND managerid = ?
  `;
  
  db.query(query, [managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

// Get count of leads with lead_type not equal to 'Meta Ads' for a specific manager
router.get('/leads/not-meta-ads/:managerid', (req, res) => {
  const { managerid } = req.params;
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE lead_type != 'Meta Ads' AND managerid = ?
  `;
  
  db.query(query, [managerid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

module.exports = router;