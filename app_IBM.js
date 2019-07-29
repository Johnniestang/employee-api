
const HTTP = require('./http.js');
const express = require ('express');
const uniqID = require('uniqid');
const Joi = require('joi');

//import Joi from 'joi';


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


// GET request Handlers



// POST request

function postEmployeeRH(req, res){
    console.log(`Endpoint requested: ${req.originalUrl}`);
    
    // Validate user
    const  {error} = validateEmployee(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    console.log(getQuote());


};


function getListOfEmployeesRH(){};
function getEmployeeRH(){};
function updateEmployeeRH(){};
function deleteEmployeeRH(){};



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



function getListOfEmployeesRH(req,res){
    console.log("LIFE CHECK");
    res.send("I'm alive");
};


function getQuote(){
    const http = new HTTP;

    http.get("https://ron-swanson-quotes.herokuapp.com/v2/quotes")
        .then(data =>{
            console.log(data);
            return data;
        })
        .catch( err => console.log(err));

    
}