const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Update travel_opportunity table with selected tag
router.put("/travel_opportunity/:id", (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag) {
        return res.status(400).json({ error: "Tag is required" });
    }

    const sql = "UPDATE travel_opportunity SET tag = ? WHERE id = ?";
    db.query(sql, [tag, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No record found with this ID" });
        }
        res.json({ message: "Tag updated successfully" });
    });
});

module.exports = router;
