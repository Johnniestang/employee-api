const http = require('http');
const app = require('./app');

// Setup server details
// Read the value of the environment variable port if set.
const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});


