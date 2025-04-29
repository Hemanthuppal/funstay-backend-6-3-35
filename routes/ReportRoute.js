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
  const { name, description, selectedFields, activeFilters, userId,type} = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Report name is required' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [result] = await db.promise().query(
      'INSERT INTO reports (name, description, selected_fields, active_filters, userId,type) VALUES (?, ?, ?, ?, ?,?)',
      [name, description, JSON.stringify(selectedFields), JSON.stringify(activeFilters), userId,type]
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

router.get("/api/fetch-lead-suppliers", (req, res) => {
  // First query to get lead and travel opportunity data
  const leadQuery = `
      SELECT a.*, t.destination AS travel_destination, t.quotation_id, 
             t.created_at AS travel_created_at, t.origincity AS travel_origincity, 
             t.start_date, t.end_date, t.duration, t.adults_count, t.children_count, 
             t.child_ages, t.approx_budget, t.description AS travel_description, t.email_sent
      FROM addleads a 
      LEFT JOIN travel_opportunity t ON a.leadid = t.leadid
      WHERE a.archive IS NULL
      ORDER BY t.leadid DESC`;

  db.query(leadQuery, (err, leadResults) => {
      if (err) {
          console.error("Error fetching lead data: ", err);
          return res.status(500).json({ error: "Database query failed" });
      }

      if (leadResults.length === 0) {
          return res.status(404).json({ message: "No lead data found" });
      }

      // Extract leadids from the results
      const leadIds = leadResults.map(lead => lead.leadid);
      
      if (leadIds.length === 0) {
          return res.json(leadResults.map(lead => ({
              ...lead,
              suppliers: [],
              payment_logs: []
          })));
      }

      // Query to get suppliers for these leadids
      const supplierQuery = `
          SELECT * FROM suppliers 
          WHERE leadid IN (?) 
          ORDER BY leadid DESC, id DESC`;
      
      // Query to get payment logs for these leadids
      const paymentLogQuery = `
          SELECT * FROM payment_log 
          WHERE leadid IN (?) 
          ORDER BY leadid DESC, paid_on DESC`;

      // Execute both queries in parallel
      db.query(supplierQuery, [leadIds], (supplierErr, supplierResults) => {
          if (supplierErr) {
              console.error("Error fetching supplier data: ", supplierErr);
              return res.status(500).json({ error: "Supplier query failed" });
          }

          db.query(paymentLogQuery, [leadIds], (paymentErr, paymentResults) => {
              if (paymentErr) {
                  console.error("Error fetching payment logs: ", paymentErr);
                  return res.status(500).json({ error: "Payment log query failed" });
              }

              // Group suppliers by leadid
              const suppliersByLead = supplierResults.reduce((acc, supplier) => {
                  if (!acc[supplier.leadid]) {
                      acc[supplier.leadid] = [];
                  }
                  acc[supplier.leadid].push(supplier);
                  return acc;
              }, {});

              // Group payment logs by leadid
              const paymentsByLead = paymentResults.reduce((acc, payment) => {
                  if (!acc[payment.leadid]) {
                      acc[payment.leadid] = [];
                  }
                  acc[payment.leadid].push(payment);
                  return acc;
              }, {});

              // Combine all data
              const combinedResults = leadResults.map(lead => ({
                  ...lead,
                  suppliers: suppliersByLead[lead.leadid] || [],
                  payment_logs: paymentsByLead[lead.leadid] || []
              }));

              res.json(combinedResults);
          });
      });
  });
});


module.exports = router;
