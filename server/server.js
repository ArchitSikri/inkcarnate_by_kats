const http = require('http');
const app = require('./app');
const dotenv = require('dotenv').config();


const server = http.createServer(app);
const PORT = process.env.PORT || 9000;


server.listen(PORT, (req, res) => {
    console.log(`server is running on port ${PORT}`);
});

