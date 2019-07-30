
const Employee = require('./employee.js');
const fetch = require("node-fetch")

const express = require ('express');
const Joi = require('joi');

const quoteURL = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
const jokeURL = "http://api.icndb.com/jokes/random";


const app = express();
app.use(express.json())


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
app.put(resourceURL, updateEmployeeRH);

// DELETE request
app.delete(resourceURL, deleteEmployeeRH);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GET request Handlers
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function getListOfEmployeesRH(req,res){
//     console.log(`Endpoint requested: ${req.originalUrl}`);
//     res.send(JSON.stringify(employees));
// }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POST request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function postEmployeeRH(req, res){
    console.log(`Endpoint requested: ${req.originalUrl}`);
    
    // Validate user input
    const  {error} = validateEmployee(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    createEmployee(req.body)
        .then ( newEmployee =>{
            const employeeObj = newEmployee.toString();
            employees.push(employeeObj);
            res.send(employeeObj);
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
   
    // Create a new Employee
    return new Employee( person.firstName,
        person.lastName,
        person.hireDate,
        person.role,
        person.joke = joke,
        person.quote = quote );
}

function validateEmployee(employee){
    const schema = {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        hireDate: Joi.date().iso().max('now'),
        // role: Joi.string().regex(/^(CEO|VP|MANAGER|LACKEY)$/).error ( errors =>{
        //     return {message: "Role must be either one of the following: CEO, VP, MANAGER, LACKEY"}
            role: Joi.string().regex(/^(CEO|VP|MANAGER|LACKEY)$/).error ( errors =>{
                return {message: `Role must be either one of the following: CEO|VP|MANAGER|LACKEY`}
        })
    }
    return Joi.validate(employee,schema);
}





function getListOfEmployeesRH(){};
function getEmployeeRH(){};
function updateEmployeeRH(){};
function deleteEmployeeRH(){};




function getListOfEmployeesRH(req,res){
    console.log("HEALTH CHECK");
    console.log(`Endpoint requested: ${req.originalUrl}`);
    res.send(JSON.stringify(employees));
};


