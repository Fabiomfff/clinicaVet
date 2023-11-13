/*
*   Repositorio Factory para especie
*
*/

// Dependencias
import { IConsultaRepo } from './repo-consulta-intf';
import { ConsultaRepoHardCoded } from './repo-consulta-mysql';
import { ConsultaRepoOrm } from './repo-consulta-orm';

let mySql: boolean = false;

export function getRepoConsulta(): IConsultaRepo {
    if (mySql === true) {
        return new ConsultaRepoHardCoded();
    } else {
        return new ConsultaRepoOrm()
    }
};
