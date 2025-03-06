// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Corrected endpoints (remove '/api' from routes)
router.get('/leads/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE DATE(created_at) = ?
  `;
  
  db.query(query, [today], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

router.get('/leads/confirmed', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS count 
    FROM addleads 
    WHERE status = 'opportunity' 
    AND DATE(created_at) = ?
  `;
  
  db.query(query, [today], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ count: results[0].count });
  });
});

router.get('/leads/in-progress', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE status = 'lead' 
      AND DATE(created_at) = ?
    `;
    
    db.query(query, [today], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count: results[0].count });
    });
  });


// Previous Day Endpoints
router.get('/leads/yesterday', (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE DATE(created_at) = ?
    `;
    
    db.query(query, [dateString], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count: results[0].count });
    });
  });
  
  router.get('/leads/confirmed/yesterday', (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
  
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE status = 'opportunity' 
      AND DATE(created_at) = ?
    `;
    
    db.query(query, [dateString], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count: results[0].count });
    });
  });
  
  router.get('/leads/in-progress/yesterday', (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
  
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE status = 'lead' 
      AND DATE(created_at) = ?
    `;
    
    db.query(query, [dateString], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ count: results[0].count });
    });
  });
  

  router.get('/leads/meta-ads', (req, res) => {
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE lead_type = 'Meta Ads'
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: results[0].count });
    });
});

// Get count of leads with lead_type not equal to 'Meta Ads'
router.get('/leads/not-meta-ads', (req, res) => {
    const query = `
      SELECT COUNT(*) AS count 
      FROM addleads 
      WHERE lead_type != 'Meta Ads'
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: results[0].count });
    });
});
module.exports = router;