const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const db = require('../config/db');

const { assignLead , adminassignLead } = require('../controllers/employeeController');


const { fetchLeadData } = require('../controllers/leadOppCommentController');

router.post('/leads', leadController.createLead);
router.post('/managerleads', leadController.managercreateLead);
router.post('/adminleads', leadController.admincreateLead);
router.get('/allleads', leadController.getAllLeads);
router.get('/leads/:leadid', leadController.getLeadById);
router.put('/leads/update/:leadid', leadController.updateLead);
router.delete('/deleteByLeadId/:leadid', leadController.deleteLead);
router.put('/leads/status/:leadid', leadController.updateLeadStatus);
router.get('/lead-opp-comment/:leadid', leadController.getLeadData);


router.put('/archiveByLeadId/:leadid', leadController.archiveLead);

router.post('/assign-lead', assignLead);


//leadoppcomments
router.get('/leadsoppcomment/:leadid', fetchLeadData);



router.post('/admin-assign-lead', adminassignLead);

router.put('/travel-opportunity/:id', (req, res) => {
    const { id } = req.params;
    const { reminder_setting, notes } = req.body;
  
    const query = `
      UPDATE travel_opportunity 
      SET reminder_setting = ?, notes = ? 
      WHERE id = ?
    `;
  
    db.query(query, [reminder_setting, notes, id], (err, result) => {
      if (err) {
        console.error('DB Update Error:', err); // Log the exact error
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json({ message: 'Updated successfully' });
    });
  });


module.exports = router;
