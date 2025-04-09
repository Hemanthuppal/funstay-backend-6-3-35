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

// PUT controller to update approx_budget
const updateTravelOpportunity = (req, res) => {
  const opportunityId = req.params.id;
  const { approx_budget } = req.body;

  if (!approx_budget || isNaN(approx_budget)) {
    return res.status(400).json({ error: 'Invalid approx_budget' });
  }

  travelOpportunityModel.updateApproxBudget(opportunityId, approx_budget, (error, result) => {
    if (error) {
      console.error('Error updating travel opportunity:', error);
      return res.status(500).json({ error: 'Failed to update approx_budget' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Travel opportunity not found' });
    }

    res.status(200).json({ message: 'Approx budget updated successfully' });
  });
};


module.exports = {
  getTravelOpportunities,
  updateTravelOpportunity,
};
