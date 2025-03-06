const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path to your database connection

// Fetch all customers
router.get('/api/customers', (req, res) => {
  const query = 'SELECT * FROM customers';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ message: "Database error." });
    }

    res.status(200).json(results); // Return all customer data
  });
});

// Fetch a customer by ID
router.get('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const query = 'SELECT * FROM customers WHERE id = ?';

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json(results[0]); // Return the specific customer data
  });
});

router.get('/api/travel-opportunities/:customerid', (req, res) => {
  const customerId = req.params.customerid;
  const query = 'SELECT * FROM travel_opportunity WHERE customerid = ?';

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching travel opportunities:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No travel opportunities found for this customer." });
    }

    res.status(200).json(results); // Return all travel opportunities for the customer
  });
});


router.delete('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;

  // Delete from travel_opportunity
  const deleteTravelOpportunities = 'DELETE FROM travel_opportunity WHERE customerid = ?';
  // Delete from addleads
  const deleteAddLeads = 'DELETE FROM addleads WHERE customerid = ?';
  // Delete from customers
  const deleteCustomer = 'DELETE FROM customers WHERE id = ?';

  db.query(deleteTravelOpportunities, [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting travel opportunities:", err);
      return res.status(500).json({ message: "Database error in travel_opportunity." });
    }

    db.query(deleteAddLeads, [customerId], (err, result) => {
      if (err) {
        console.error("Error deleting leads:", err);
        return res.status(500).json({ message: "Database error in addleads." });
      }

      db.query(deleteCustomer, [customerId], (err, result) => {
        if (err) {
          console.error("Error deleting customer:", err);
          return res.status(500).json({ message: "Database error in customers." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Customer not found." });
        }

        res.status(200).json({ message: "Customer and related data deleted successfully." });
      });
    });
  });
});



router.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name,country_code, phone_number, email } = req.body;

  // Update `customers` table
  const updateCustomerQuery = `
    UPDATE customers 
    SET name = ?, country_code = ?, phone_number = ?, email = ? 
    WHERE id = ?
  `;

  // Update `addleads` table
  const updateAddLeadsQuery = `
    UPDATE addleads 
    SET name = ?, country_code = ?, phone_number = ?, email = ? 
    WHERE customerid = ?
  `;

  // Execute both queries
  db.query(updateCustomerQuery, [name,country_code, phone_number, email, id], (err, results) => {
    if (err) {
      console.error('Error updating customer details:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    db.query(updateAddLeadsQuery, [name,country_code, phone_number, email, id], (err, results) => {
      if (err) {
        console.error('Error updating addleads details:', err);
        return res.status(500).json({ message: 'Database error.' });
      }

      res.status(200).json({ message: 'Customer and addleads updated successfully.' });
    });
  });
});



router.put('/api/travel-opportunities/:id', (req, res) => {
  const { id } = req.params;
  const {
    origincity,
    destination,
    start_date,
    end_date,
    duration,
    adults_count,
    children_count,
    child_ages,
    approx_budget,
    reminder_setting,
    notes,
  } = req.body;

  const query = `
    UPDATE travel_opportunity
    SET 
    origincity = ?,
      destination = ?, 
      start_date = ?, 
      end_date = ?, 
      duration = ?, 
      adults_count = ?, 
      children_count = ?, 
      child_ages = ?, 
      approx_budget = ?, 
      reminder_setting = ?, 
      notes = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [
      origincity,
      destination,
      start_date,
      end_date,
      duration,
      adults_count,
      children_count,
      child_ages,
      approx_budget,
      reminder_setting,
      notes,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error('Error updating travel opportunity:', err);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Travel opportunity not found.' });
      }

      res.status(200).json({ message: 'Travel opportunity updated successfully.' });
    }
  );
});


module.exports = router;