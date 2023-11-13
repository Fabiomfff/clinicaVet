/*
* Codigo relacionado a Rotas  
*
*/

// Dependencias
import clienteRouter from './routers/router-cliente';
import usuarioRouter from './routers/router-usuario';
import veterinarioRouter from './routers/router-veterinario';
import especieRouter from './routers/router-especie';
import animalRouter from './routers/router-animal';
import loginRouter from './routers/router-login';
import consultaRouter from './routers/router-consulta';

// Dependencia Auth 
import authmid from './middlewares/mid-authentication';
import aniConRouter from './routers/routes-animal-consulta';

const configRoutes = function (app) {

    // Routers login
    app.use('/login', loginRouter)

       
    //  Auth pro resto
    app.use(authmid.authenticate)


    //Routers Consulta
    app.use('/consulta', consultaRouter);
    
    // Routers do Cliente
    app.use('/cliente', clienteRouter);

    // Routers de Usuario
    app.use('/usuario', usuarioRouter);

    // Routers de Veterinario
    app.use('/veterinario', veterinarioRouter);

    // Routers de Especie
    app.use('/especie', especieRouter);

    // Routers de Animal
    app.use('/animal', animalRouter);

    app.use('/aniconsulta', aniConRouter);
};



export = configRoutes;