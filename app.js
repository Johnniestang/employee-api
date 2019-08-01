const express = require('express');
const exphbs = require('express-handlebars');
const employees = require('./employees');


const employeesRoutes = require('./api/routes/employees');
const logger = require('./middleware/logger');

const app = express();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup middleware
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Handlebar Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Logger
app.use(logger);

// Body Parser with form submission
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res,) =>{
    res.render('index',{
        title: 'Employees',
        employees
    });
})

// Init middleware
app.use( '/api/employees', employeesRoutes);


module.exports = app;