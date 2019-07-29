const http = require('http');


const server = http.createServer((req, response) => {
    // This anonymous funciton is hit whenever a request comes into the server
    if (req.url === '/'){
        //....
        console.log("Home pinged");
        response.write('Hello World');
        response.end;
    }

    if (req.url === '/api/books'){
        console.log("Endpoint requested: ", req.url);
        const data = [ { id: 1, name:"John", email:"johnniestang@gamil.com"},
                       { id: 2, name:"Bill", email:"billiewang@gamil.com"}];
        response.write(JSON.stringify(data));
        response.end(JSON.stringify(data));
        console.log("Data sent");
    }
});

server.listen(3000, (err)=> {
    if (err){
        console.log("Something went horribily wrong", err);
    }

    console.log("Listening on Port 3000");
});




