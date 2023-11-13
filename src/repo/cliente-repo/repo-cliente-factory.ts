/*
*   Repositorio Factory para cliente
*
*/

// Dependencias
import { ClienteRepoHardcoded } from './repo-cliente-mysql';
import { IClienteRepo } from './repo-cliente-intf';
import { ClienteRepoOrm } from './repo-cliente-orm';

let mysql: boolean = false;

// Função GET 
export function getRepo(): IClienteRepo { 

    if (mysql === true) {
        return new ClienteRepoHardcoded();
    } else {
        return new ClienteRepoOrm
    }
};
 