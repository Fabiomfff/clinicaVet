/*
* Router relacionado ao Usuario
*
*/


// Dependencias
import usuarioHandler = require('../handlers/handler-usuario');
import express = require('express');
const usuarioRouter = express.Router();

const usuHandler = usuarioHandler;

// Router para Get
usuarioRouter.get('/', usuHandler.getHandler);


// Router para Get
usuarioRouter.get('/:id', usuHandler.getIdHandler);

//Router para Post
usuarioRouter.post('/', usuHandler.postHandler);

//Router para Put
usuarioRouter.put('/:id', usuHandler.putHandler);

//Router para Delete
usuarioRouter.delete('/:id', usuHandler.deleteHandler);

// Export
export = usuarioRouter;