'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const employees = require('./employees');
const morgan = require('morgan');

const employeeRoutes = require('./api/routes/employees');
const indexRoute = require('./api/routes/index');

const app = express();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup middleware
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Handlebar Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Logger
//app.use(logger);
app.use(morgan('[:date[clf]] ":method :url" Status: :status Response: :res[content-length] characters - :response-time ms'));

// Body Parser with form submission
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Routes
app.use( '/api/employees', employeeRoutes);
app.use( '/employee/submit', indexRoute);

// For small project will combine front end with Back  
app.get('/employees/',(req,res,) =>{
    res.render('index',{
        title: 'Employees',
        employees
    });
})


// Fail over route
app.use( (req,res) =>{
    res.status(404).send('Not Found');
});



module.exports = app;