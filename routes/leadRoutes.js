const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

const { assignLead , adminassignLead } = require('../controllers/employeeController');


const { fetchLeadData } = require('../controllers/leadOppCommentController');

router.post('/leads', leadController.createLead);
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




module.exports = router;
