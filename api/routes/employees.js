const express   = require('express');
const Joi       = require('joi');
const fetch     = require("node-fetch")
const Employee  = require('../../models/employee.js');
const employees = require('../../employees');

// Setup router
const router = express.Router();

const quoteURL = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
const jokeURL = "http://api.icndb.com/jokes/random";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Data (use in memory versus database)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//const employees = [];
// Moved to its own file


// Routes
router.get('/', getListOfEmployeesRH);
router.post('/', postEmployeeRH);

router.get('/:id', getEmployeeRH);
router.put('/:id', updateEmployeeRH);
router.delete('/:id', deleteEmployeeRH);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// POST request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function postEmployeeRH(req, res, next){

    // Validate user input
    if (req.body === undefined){
        return res.status(400).json({message: "Missing data"});
    }
    const  {error} = validateEmployee(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }

    createEmployee(req.body)
        .then ( newEmployee =>{
            employees.push(newEmployee);
            res.status(201).json(newEmployee);
            //res.redirect('/employees');
        })
        .catch(err =>{
            console.log(err);
            res.status(400).json(err);
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



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GET request Handlers
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function getListOfEmployeesRH(req,res){
    // res.send(JSON.stringify(employees));
    res.json(employees);
};

function getEmployeeRH(req,res){
    
    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        return res.status(404).json({message: `The employee with id ${id} could not be located`});
    }

    res.json(foundEmployee);
};



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PUT request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateEmployeeRH(req,res){

    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        return res.status(404).json({message:`The employee with id ${id} could not be located`});
    }

    // validate user input and update
    const updatedEmployee = req.body;
    const {error} = validateEmployee(updatedEmployee);
    if (error){
        res.status(400).json({message: error.details[0].message});
    } else {
        foundEmployee.update(updatedEmployee);
        res.json(foundEmployee);
    }

};



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DELETE request Handlers
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function deleteEmployeeRH(req,res){

    const id = req.params.id;
    const foundEmployee = findEmployee(id) 
    if (foundEmployee === null){
        return res.status(404).json({message: `The employee with id ${id} could not be located`});
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




module.exports = router;