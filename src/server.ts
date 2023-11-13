
/* 
* Starta o server
*
*/

// Dependencias

import authMid = require('./middlewares/mid-authentication');
import configRoutes = require('./routes');
import express = require("express");


const port = 3000;

const app= express();

// recebe json para o POST 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router generico para teste
app.get('/', function (req, res) {
    res.send('hello world');
});

configRoutes(app);

// Começa o server
app.listen(port, function () {
    console.log('app is running on port 3000');
});

