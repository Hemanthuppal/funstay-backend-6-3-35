const travelOpportunityModel = require('../models/travelOpportunityModel');

// Controller to fetch all travel opportunities
const getTravelOpportunities = (req, res) => {
  travelOpportunityModel.getAllTravelOpportunities((error, results) => {
    if (error) {
      console.error('Error fetching travel opportunities:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Check if results contain any data
    if (results.length > 0) {
      // Send all records together in the response
      const formattedResults = results.map(result => ({
        id: result.id,
        leadid: result.leadid,
        destination: result.destination,
        start_date: result.start_date,
        end_date: result.end_date,
        duration: result.duration,
        adults_count: result.adults_count,
        children_count: result.children_count,
        child_ages: result.child_ages,
        approx_budget: result.approx_budget,
        assignee: result.assignee,
        notes: result.notes,
        comments: result.comments,
        reminder_setting: result.reminder_setting,
      }));

      // Send the formatted results as a single response
      res.status(200).json(formattedResults);  // All records in a single response
    } else {
      res.status(404).json({ message: 'No travel opportunities found' });
    }
  });
};

module.exports = {
  getTravelOpportunities,
};
