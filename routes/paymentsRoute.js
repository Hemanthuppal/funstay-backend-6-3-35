const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post("/payments", (req, res) => {
    const { leadid, paid_amount, balance_amount, paid_on, remarks, userid, username, status } = req.body;
  
    // First, get customerid from addleads table
    const getLeadQuery = "SELECT customerid FROM addleads WHERE leadid = ?";
    db.query(getLeadQuery, [leadid], (err, results) => {
      if (err) {
        console.error("Error fetching customerid:", err);
        return res.status(500).json({ error: "Error fetching lead info" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Lead not found" });
      }
  
      const customerid = results[0].customerid;
  
      // Now insert payment
      const insertQuery = `
        INSERT INTO receivables 
        (leadid, customerid, paid_amount, balance_amount, paid_on, remarks, userid, username, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [leadid, customerid, paid_amount, balance_amount, paid_on, remarks, userid, username, status],
        (err, result) => {
          if (err) {
            console.error("Error inserting payment:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(200).json({ message: "Payment saved successfully" });
        }
      );
    });
  });

//   router.get("/payments", (req, res) => {
//     const query = "SELECT * FROM receivables";
    
//     db.query(query, (err, results) => {
//       if (err) {
//         return res.status(500).json({ message: "Error fetching receivables", error: err });
//       }
//       res.status(200).json(results);
//     });
//   });

router.get("/payments", (req, res) => {
    const { leadid } = req.query;
    let query = "SELECT * FROM receivables";
    const params = [];
  
    if (leadid) {
      query += " WHERE leadid = ?";
      params.push(leadid);
    }
  
    db.query(query, params, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching receivables", error: err });
      }
      res.status(200).json(results);
    });
  });


  router.put("/update-status/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    // First, check if the payment exists
    const checkQuery = "SELECT * FROM receivables WHERE id = ?";
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error("Error checking payment record:", err);
        return res.status(500).json({ error: "Database error while checking record" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Payment record not found" });
      }
  
      // Update the status field
      const updateQuery = "UPDATE receivables SET status = ? WHERE id = ?";
      db.query(updateQuery, [status, id], (err, result) => {
        if (err) {
          console.error("Error updating status:", err);
          return res.status(500).json({ error: "Database error while updating status" });
        }
  
        res.status(200).json({ message: "Status updated successfully" });
      });
    });
  });
  


  
  module.exports = router;