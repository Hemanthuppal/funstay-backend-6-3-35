const express = require('express');
const router = express.Router();
const travelOpportunityController = require('../controllers/travelOpportunityController');

// Define the route
router.get('/travel-opportunity', travelOpportunityController.getTravelOpportunities);

module.exports = router;
