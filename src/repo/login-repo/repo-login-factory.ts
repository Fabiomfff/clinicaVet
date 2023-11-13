/*
*   Repositorio Factory para login
*
*/

// Dependencias
import { LoginRepoHardcoded } from './repo-login-mysql';
import { ILoginRepo } from './repo-login-intf';
import { LoginRepoOrm } from './repo-login-orm';


let mySql: boolean = false;

// Função GET 
export function getRepoLogin(): ILoginRepo {

    if (mySql === true) {
        return new LoginRepoHardcoded();
    } else {
        return new LoginRepoOrm();
    }
};