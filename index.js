const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Import all cron job scripts
// require("./adminRep");
// require("./managerRep");
// require("./salesRep");
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leadRoutes = require('./routes/leadRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const commentRoutes = require('./routes/commentRoutes');
const editleadoppRoute = require("./routes/editleadoppRoute");
const assigneeRoute = require("./routes/assigneeRoute")
const travelOpportunityRoute = require("./routes/travelOpportunityRoutes")
const myteamRoutes = require('./routes/myteamRoutes');
const createcustomeRoute = require('./routes/createcustomeRoute');
const updatecustomerroute = require('./routes/updatecustomerroute');
const customertableroute = require('./routes/customertableroute');
const forgotpasswordRoute = require('./routes/forgotpassword');
const countRoute = require('./routes/countRoute');
const managercountRoute = require('./routes/managercountRoute');
const salescountRoute = require('./routes/salescountRoute');
const notificationRoute = require('./routes/notificationRoute');
const getemployeebyidRoute = require('./routes/getemployeebyidRoute');
const addmanagerRoute = require('./routes/addmanagerRoute');
const getandgetbyidemployeeRoute = require('./routes/getandgetbyidemployeeRoute');
const leadandtraveldataRoute = require('./routes/leadandtraveldataRoute');
const destinationRoute = require('./routes/destinationRoute');
const selfassignRoute = require('./routes/selfassignRoute');
const archieveRoute = require('./routes/archieveRoute');
const path = require("path");
const themeRoute = require("./routes/themeRoute");
const quotationRoutes = require("./routes/quotationRoutes");
const tagRoutes = require('./routes/tagRoutes');
const tagUpdateRoutes = require('./routes/tagUpdateRoute');
const filterTagRoute = require('./routes/filterTagRoute');
const quotationRoute = require('./routes/quotationRoute-22-4-25final');
const supplierRoute = require('./routes/supplierRoute');
const paymentsRoute = require('./routes/paymentsRoute');
const reportRoute = require('./routes/ReportRoute');
const supplierlistRoute = require('./routes/supplierlistRoute');



const newRoutes = require('./routes/newsupplierroute');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/', authRoutes);
app.use('/', employeeRoutes);
app.use('/api', leadRoutes);
app.use('/api', opportunityRoutes);
app.use('/', commentRoutes);
app.use("/api", editleadoppRoute);
app.use('/', assigneeRoute);
app.use('/', travelOpportunityRoute);
app.use('/', myteamRoutes);
app.use('/', createcustomeRoute);
app.use('/', updatecustomerroute);
app.use('/', customertableroute);
app.use('/', forgotpasswordRoute);
app.use('/', countRoute);
app.use('/', managercountRoute);
app.use('/', salescountRoute);
app.use('/', notificationRoute);
app.use('/', getemployeebyidRoute);
app.use('/', addmanagerRoute);
app.use('/', getandgetbyidemployeeRoute);

app.use('/api', leadandtraveldataRoute);
app.use('/api', destinationRoute);
app.use("/api", themeRoute);
app.use('/api', selfassignRoute);
app.use('/api', archieveRoute);
app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static('routes/uploads'));
 
app.use("/api/quotations", quotationRoutes);

app.use('/api', tagRoutes);
app.use('/api', tagUpdateRoutes);
app.use('/api', filterTagRoute);
app.use('/api', quotationRoute);
app.use('/api', supplierRoute);
app.use('/api', paymentsRoute);
app.use('/', reportRoute);
app.use('/api', supplierlistRoute);



app.use('/api', newRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
