const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route to fetch data from addleads and travel_opportunity tables
router.get("/fetch-data", (req, res) => {
    const query = `
    SELECT a.*, t.destination AS travel_destination, t.created_at AS travel_created_at 
    FROM addleads a 
    LEFT JOIN travel_opportunity t 
    ON a.leadid = t.leadid
    ORDER BY t.leadid DESC`; // Ordering by travel_created_at in descending order

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data: ", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        // Check if results are empty
        if (results.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }
        res.json(results);
    });
});

router.put("/update-lead-customer/:leadid", (req, res) => {
    console.log("Request Body:", req.body); // Log the request body
    const leadid = req.params.leadid;

    const {
        lead_type,
        name,
        country_code,
        phone_number,
        email,
        sources,
        description,
        another_name,
        another_email,
        another_phone_number,
        origincity,
        destination,
        corporate_id,
        primaryStatus,
        secondaryStatus,
        primarySource,
        secondarysource,
    } = req.body;

    // Update the lead information
    const updateLeadQuery = `
      UPDATE addleads 
      SET lead_type = ?, name = ?, country_code = ?, phone_number = ?, email = ?, sources = ?, 
          description = ?, another_name = ?, another_email = ?, another_phone_number = ?,origincity = ?, 
          destination = ?, corporate_id = ?, primaryStatus = ?, secondaryStatus = ?, 
          primarySource = ?, secondarysource = ?
      WHERE leadid = ?`;

    db.query(updateLeadQuery, [
        lead_type, name, country_code, phone_number, email, sources, description, 
        another_name, another_email, another_phone_number, origincity, destination, corporate_id, 
        primaryStatus, secondaryStatus, primarySource, secondarysource, leadid
    ], (err, result) => {
        if (err) {
            console.error("Error updating addleads: ", err);
            return res.status(500).json({ error: "Failed to update addleads" });
        }

        // Fetch the customerid from the addleads table using the leadid
        const getCustomerIdQuery = `
          SELECT customerid FROM addleads WHERE leadid = ?`;
        
        db.query(getCustomerIdQuery, [leadid], (err, leadResults) => {
            if (err) {
                console.error("Error fetching customer ID: ", err);
                return res.status(500).json({ error: "Failed to fetch customer ID" });
            }

            if (leadResults.length > 0) {
                const customerid = leadResults[0].customerid; // Get the customerid from the lead

                // Check if the customer exists and is new
                const checkCustomerQuery = `
                  SELECT customer_status FROM customers WHERE id = ?`; // Assuming 'id' is the primary key in customers
                
                db.query(checkCustomerQuery, [customerid], (err, customerResults) => {
                    if (err) {
                        console.error("Error fetching customer: ", err);
                        return res.status(500).json({ error: "Failed to fetch customer data" });
                    }

                    if (customerResults.length > 0 && customerResults[0].customer_status === "new") {
                        // Update the customer information if the status is new
                        const updateCustomerQuery = `
                          UPDATE customers 
                          SET name = ?, country_code = ?, phone_number = ?, email = ?
                          WHERE id = ?`; // Assuming 'id' is the primary key in customers

                        db.query(updateCustomerQuery, [name, country_code, phone_number, email, customerid], (err, customerUpdateResult) => {
                            if (err) {
                                console.error("Error updating customers: ", err);
                                return res.status(500).json({ error: "Failed to update customers" });
                            }
                            return res.json({ message: "Lead and Customer updated successfully" });
                        });
                    } else {
                        return res.json({ message: "Lead updated successfully, no customer update needed" });
                    }
                });
            } else {
                return res.status(404).json({ error: "No lead found with the given leadid" });
            }
        });
    });
});






module.exports = router;