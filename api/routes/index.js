const express   = require('express');
const fetch     = require("node-fetch")

// Setup router
const router = express.Router();


// Routes
router.post('/', (req,res,next)=>{

    postEmployee('http://localhost:3000/api/employees', req.body)
        .then( data => {
            res.redirect('/employees');
        })
        .then (err => {
            console.log(err);
        });

});

async function postEmployee(url, data){
    const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    const responseData = await response.json();
    return responseData;
}


module.exports = router;