const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get employee details by ID
router.get("/employee/:id", (req, res) => {
  const employeeId = req.params.id;
  const query = "SELECT * FROM employees WHERE id = ?";
  
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(results[0]);
  });
});

// Update employee details including image
router.put("/employee/update/:id", upload.single("image"), (req, res) => {
  const employeeId = req.params.id;
  console.log("Received Body:", req.body);
  const { name, email, mobile, dob, qualification, address } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  console.log("Received Body:", req.file);
  let query = "UPDATE employees SET name=?, email=?, mobile=?, dob=?, qualification=?, address=?";
  let values = [name, email, mobile, dob, qualification, address];

  if (image) {
    query += ", image=?";
    values.push(image);
  }

  query += " WHERE id=?";
  values.push(employeeId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});




router.put("/updateemployee/:id", (req, res) => {
  const employeeId = req.params.id;
  console.log("Received Body:", req.body);

  const { name, email, mobile, password, role, managerId, assign_manager } = req.body;

  // Update query with correct syntax
  let query = `
    UPDATE employees 
    SET name = ?, email = ?, mobile = ?, password = ?, role = ?, managerId = ?, assign_manager = ? 
    WHERE id = ?`;

  let values = [name, email, mobile, password, role, managerId, assign_manager, employeeId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});
module.exports = router;
