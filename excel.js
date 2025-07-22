const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'ebazaar' // your database
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// File Upload Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Excel Upload Route
app.post('/upload-excel', upload.single('excel'), (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    data.forEach(row => {
      const sql = `INSERT INTO organizations 
        (name_of_organization, contact_person, address, city, state, pin, std_code, telephone, fax, mobile1, mobile2, website, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        row["Name of Organization"] || '',
        row["Contact Person"] || '',
        row["Address"] || '',
        row["City"] || '',
        row["State"] || '',
        row["Pin"] || '',
        row["STD Code"] || '',
        row["Telephone"] || '',
        row["Fax"] || '',
        row["Mobile 1"] || '',
        row["Mobile 2"] || '',
        row["Website"] || '',
        row["Email"] || ''
      ];

      db.query(sql, values, (err) => {
        if (err) console.error(err);
      });
    });

    res.json({ message: 'Excel data inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
