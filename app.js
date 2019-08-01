const express = require('express');

const app = express();

const employeesRoutes = require('./api/routes/employees');
const logger = require('./middleware/logger');

// Setup middleware
app.use(logger);
// Body Parser
app.use(express.json());
// Handle form submissions
app.use(express.urlencoded({extended:false}));
// Init middleware
app.use( '/api/employees', employeesRoutes);


module.exports = app;