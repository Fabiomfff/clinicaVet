/*
*   Repositorio Factory para especie
*
*/

// Dependencias
import { UsuarioRepoHardcoded } from './repo-usuario-mysql';
import { IUsuarioRepo } from './repo-usuario-intf';
import { UsuarioRepoOrm } from './repo-usuario-orm';

let mySql2: boolean = false;

// Função GET 
export function getRepoUsuario(): IUsuarioRepo {
    if (mySql2 == true) {
        return new UsuarioRepoHardcoded();
    } else {
        return new UsuarioRepoOrm()
    }
};
