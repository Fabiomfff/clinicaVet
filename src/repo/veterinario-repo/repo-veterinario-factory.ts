/*
*   Repositorio Factory para especie
*
*/

// Dependencias
import { VeterinarioRepoSQL } from './repo-veterinario-mysql';
import { IVeterinarioRepo } from './repo-veterinario-intf';
import { VeterinarioRepoOrm } from './repo-veterinario-orm';

let mysql: boolean = false;

// Função GET 
export function getRepoVeterinario(): IVeterinarioRepo {

    if (mysql === true) {
        return new VeterinarioRepoSQL();
    } else {
        return new VeterinarioRepoOrm();
    }
};
