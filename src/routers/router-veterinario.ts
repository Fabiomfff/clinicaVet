/*
* Router relacionado ao veterinaro
*
*/


// Dependencias
import veterinarioHandler = require('../handlers/handler-veterinario');
import express = require('express');
const veterinaroRouter = express.Router();

const vetHandler = veterinarioHandler;

// Router para Get
veterinaroRouter.get('/', vetHandler.getHandler);

veterinaroRouter.get('/:id',vetHandler.getOneHandler)

//Router para Post
veterinaroRouter.post('/', vetHandler.postHandler);

//Router para Put
veterinaroRouter.put('/:id', vetHandler.putHandler);

//Router para Delete
veterinaroRouter.delete('/:id', vetHandler.deleteHandler);

// Export
export = veterinaroRouter;