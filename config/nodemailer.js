const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iiiqbetsvarnaaz@gmail.com", // Replace with your email
    pass: "rbdy vard mzit ybse", // Use app password for security
  },
});

module.exports = transporter;
