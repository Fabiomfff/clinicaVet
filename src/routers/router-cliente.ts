/*
* Router relacionado ao Cliente
*
*/

// Dependencias
import { clienteHandler } from '../handlers/handler-cliente';
import express = require('express');
var clienteRouter = express.Router(); 


// Router para Get
clienteRouter.get('/', clienteHandler.getHandler);  

//Router Get com ID
clienteRouter.get('/:id', clienteHandler.getIdHandler)

//Router para Post
clienteRouter.post('/', clienteHandler.postHandler);

//Router para Put
clienteRouter.put('/:id', clienteHandler.putHandler);

//Router para Delete
clienteRouter.delete('/:id', clienteHandler.deleteHandler);

// Export
export = clienteRouter