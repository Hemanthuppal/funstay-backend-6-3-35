const express = require("express");
const router = express.Router();
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const nodemailer = require("nodemailer");

router.use(express.json());

const imapConfig = {
  user: "uppalahemanth4@gmail.com",
  password: "oimoftsgtwradkux",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

// Function to get emails from a specific mailbox
const fetchEmailsFromBox = (imap, mailbox, searchCriteria) => {
  return new Promise((resolve, reject) => {
    imap.openBox(mailbox, false, (err, box) => {
      if (err) {
        reject(`Error opening ${mailbox}: ${err}`);
        return;
      }

      imap.search(searchCriteria, (err, results) => {
        if (err || !results.length) {
          resolve([]);
          return;
        }

        const fetchOptions = { bodies: "", markSeen: true };
        const f = imap.fetch(results, fetchOptions);
        const emails = [];

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream)
              .then((parsed) => {
                emails.push({
                  from: parsed.from.text,
                  to: parsed.to.text,
                  subject: parsed.subject,
                  text: parsed.text,
                  date: new Date(parsed.date).toISOString(),
                });
              })
              .catch((err) => console.error(`Error parsing email: ${err}`));
          });
        });

        f.once("error", (err) => reject(`Fetch error: ${err}`));
        f.once("end", () => resolve(emails));
      });
    });
  });
};

// Get all emails (received & sent)
const getEmails = () => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", async () => {
      try {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 1); // Yesterday
        sinceDate.setHours(17, 0, 0, 0); // 5:00 PM
        const sinceFormatted = sinceDate.toISOString().split("T")[0];

        // Fetch received emails
        const receivedEmails = await fetchEmailsFromBox(imap, "INBOX", [
          ["SINCE", sinceFormatted],
          ["FROM", "uppalabharadwaj31@gmail.com"],
        ]);

        // Fetch sent emails
        const sentEmails = await fetchEmailsFromBox(imap, "[Gmail]/Sent Mail", [
          ["SINCE", sinceFormatted],
          ["TO", "uppalabharadwaj31@gmail.com"],
        ]);

        resolve([...receivedEmails, ...sentEmails]);
        imap.end();
      } catch (error) {
        reject(`Error fetching emails: ${error}`);
        imap.end();
      }
    });

    imap.once("error", (err) => reject(`IMAP error: ${err}`));
    imap.once("end", () => console.log("IMAP Connection ended."));
    imap.connect();
  });
};

// API to fetch emails
router.get("/emails", async (req, res) => {
  try {
    const emails = await getEmails();
    res.json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uppalahemanth4@gmail.com",
    pass: "oimoftsgtwradkux",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// API to send email
router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  try {
    await transporter.sendMail({
      from: "uppalahemanth4@gmail.com",
      to,
      subject,
      text,
    });
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
