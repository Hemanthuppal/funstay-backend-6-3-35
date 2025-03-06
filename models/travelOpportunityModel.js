const db = require('../config/db'); // Assuming you have a DB config file

// Fetch all travel opportunities with additional fields
const getAllTravelOpportunities = (callback) => {
  const query = `
    SELECT id,leadid, destination, start_date, end_date, duration, adults_count, 
           children_count, child_ages, approx_budget, assignee, notes, 
           comments, reminder_setting
    FROM travel_opportunity
  `;
  
  db.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllTravelOpportunities,
};
