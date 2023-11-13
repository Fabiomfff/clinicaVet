/*
*   Repositorio Factory para especie
*
*/

// Dependencias
import { EspecieRepoHardcoded } from './repo-especie-mysql';
import { IEspecieRepo } from './repo-especie-intf';
import { EspecieRepoOrm } from './repo-especie-orm';

let mySql: boolean = false;

// Função GET 
export function getRepoEspecie(): IEspecieRepo {
    if (mySql === true) {
        return new EspecieRepoHardcoded();
    } else {
        return new EspecieRepoOrm()
    }
};
