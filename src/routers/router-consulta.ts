/*
* Router relacionado ao Cliente
*
*/

// Dependencias
import express = require('express');
import consultaHandler = require('../handlers/handler-consulta');


var consultaRouter = express.Router();

// Router para Get
consultaRouter.get('/', consultaHandler.getHandler);

//Router Get com ID
consultaRouter.get('/:id', consultaHandler.getIdHandler)

//Router para Post
consultaRouter.post('/', consultaHandler.postHandler);

//Router para Put
consultaRouter.put('/:id', consultaHandler.putHandler);

//Router para Delete
consultaRouter.delete('/:id', consultaHandler.deleteHandler);

// Export
export = consultaRouter