
const Employee  = require('./employee.js');
const fetch     = require("node-fetch")
const express   = require('express');
const Joi       = require('joi');

const logger = require('./middleware/logger');

const quoteURL = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
const jokeURL = "http://api.icndb.com/jokes/random";


// Start up the Express Framework
const app = express();

// Setup middleware for logging
app.use(logger);


// Setup server details
// Read the value of the environment variable port if set.
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Data (use in memory versus database)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const employees = [];



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Endpoint
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const resourceURL = '/api/employees/';
// GET request
app.get(resourceURL, getListOfEmployeesRH);
app.get(`${resourceURL}:id`, getEmployeeRH);

// POST request
app.post(resourceURL, postEmployeeRH);

//PUT request
app.put(`${resourceURL}:id`, updateEmployeeRH);

// DELETE request
app.delete(`${resourceURL}:id`, deleteEmployeeRH);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GET request Handlers
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function getListOfEmployeesRH(req,res){
    // res.send(JSON.stringify(employees));
    res.json(employees);
};

function getEmployeeRH(req,res){
    // Find Employee based on ID parameter
    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        res.status(404).json({error: `The employee with id ${id} could not be located`});
        return;
    }

    //res.send(JSON.stringify(foundEmployee));
    res.json(foundEmployee);

};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POST request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function postEmployeeRH(req, res){

    // Validate user input
    if (req.body === undefined){
        res.status(400).json({error: "Missing data"});
        return;
    }
    const  {error} = validateEmployee(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    createEmployee(req.body)
        .then ( newEmployee =>{
            // const employeeObj = newEmployee.toString();
            // employees.push(employeeObj);
            // res.send(employeeObj);            ;
            employees.push(newEmployee);
            res.send(JSON.stringify(newEmployee));
        })
        .catch(err =>{
            console.log(err);
            res.status(400).send(err);
        });

};


async function createEmployee(person){
    // get joke
    const jokeResponse = await fetch(jokeURL);
    const jokeData = await jokeResponse.json();
    const joke = jokeData.value.joke;

    // Get Quote
    const quoteResponse = await fetch(quoteURL);
    const quoteData = await quoteResponse.json();
    const quote = quoteData[0];
   console.log(person);
    // Create a new Employee
    return new Employee( person.firstName,
        person.lastName,
        person.hireDate,
        person.role,
        person.joke = joke,
        person.quote = quote );
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PUT request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateEmployeeRH(req,res){

    // Find Employee based on ID parameter
    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        res.status(404).send(`The employee with id ${id} could not be located`);
        return;
    }

    // validate user input and update
    const updatedEmployee = req.body;
    const {error} = validateEmployee(updatedEmployee);
    if (error){
        res.status(400).send(error.details[0].message);
    } else {
        foundEmployee.update(updatedEmployee);
        res.json(foundEmployee);
    }

};



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DELETE request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function deleteEmployeeRH(req,res){

    // Find Employee based on ID parameter
    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        res.status(404).send(`The employee with id ${id} could not be located`);
        return;
    }

    // remove entry from data
    const index = employees.indexOf(foundEmployee);
    employees.splice(index,1);

    res.json(foundEmployee);

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpers/Utilities
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validateEmployee(employee){
    const schema = {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        hireDate: Joi.date().iso().max('now'),
        role: Joi.string().regex(/^(CEO|VP|MANAGER|LACKEY)$/).error ( errors =>{
            return {message: `Role must be either one of the following: CEO|VP|MANAGER|LACKEY`}
        })
    }
    return Joi.validate(employee,schema);
}


function findEmployee(id){
    const employee = employees.find( person =>{
        return person.id === id;
    });
    
    if (employee === undefined){
        return null;
    }

    return employee;
}







