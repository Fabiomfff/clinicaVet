/*
*   Sql Connect para Cliente
*
*/

// Dependencias
import mysql from 'mysql2'
import dbconfig from './dbconfig';
import { DataSource } from 'typeorm';
import { EUsuario } from '../entities/entitity-usuario';
import { ECliente } from '../entities/entitiy-cliente';
import { EVeterinario } from '../entities/entitity-veterinario';
import { EEspecie } from '../entities/entitity-especie'
import { ELogin } from '../entities/entitty-login';
import { EAnimal } from '../entities/entity-animal';
import { EConsulta } from '../entities/entity-consulta';
import { EAniCon } from '../entities/entity-consulta-animais';


export const connection = mysql.createPool(dbconfig);
export  const appDataSource = new DataSource({
    type: "mysql",
    host: dbconfig.host,
    username: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    entities: [EUsuario, ECliente, EVeterinario, EEspecie, ELogin, EAnimal, EConsulta, EAniCon],
    synchronize: false
});

appDataSource.initialize().then(async () => {
    console.log('ORM CONECTADO A DATABASE')
})

