/*
* Router relacionado a Animais
*
*/

// Dependencias
import { animalHandler } from '../handlers/handler-animal';
import express = require('express');
const animalRouter = express.Router();

// Router para Get
animalRouter.get('/', animalHandler.getHandler);

//Router para get One
animalRouter.get('/:id', animalHandler.getIdHandler);

//Router para Post
animalRouter.post('/', animalHandler.postHandler);

//Router para Put
animalRouter.put('/:id', animalHandler.putHandler);

//Router para Delete
animalRouter.delete('/:id', animalHandler.deleteHandler);

// Export
export = animalRouter