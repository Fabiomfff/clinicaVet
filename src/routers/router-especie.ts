/*
* Router relacionado a especie
*
*/

// Dependencias
import { especieHandler } from '../handlers/handler-especie';
import express = require('express');
const especieRouter = express.Router();

// Router para Get
especieRouter.get('/', especieHandler.getHandler);

// Router para Get com id
especieRouter.get('/:id', especieHandler.getOneHandler)

//Router para Post
especieRouter.post('/', especieHandler.postHandler);

especieRouter.put('/:id', especieHandler.putHandler);

//Router para Delete
especieRouter.delete('/:id', especieHandler.deleteHandler);

// Export
export = especieRouter;