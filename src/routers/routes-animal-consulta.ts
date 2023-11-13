
// Dependencias
import { AniConHandler } from "../handlers/handler-animal-consulta";
import express = require('express');
const aniConRouter = express.Router();

// Router para Get
aniConRouter.get('/', AniConHandler.getHandler);

//Router para get One
aniConRouter.get('/:id', AniConHandler.getIdHandler);

//Router para Post
aniConRouter.post('/', AniConHandler.postHandler);

//Router para Put
aniConRouter.put('/:id', AniConHandler.putHandler);

//Router para Delete
aniConRouter.delete('/:id', AniConHandler.deleteHandler);

// Export
export = aniConRouter