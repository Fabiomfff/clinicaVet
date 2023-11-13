/*
* Router para fazer login
*
*/


// Dependencias
import { loginHandler } from '../handlers/handler-login';
import express = require('express');
const loginRouter = express.Router();


loginRouter.post('/', loginHandler.postHandler);

export = loginRouter;