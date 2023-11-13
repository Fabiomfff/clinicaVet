/*
*   Repositorio Factory para cliente
*
*/

// Dependencias
import { IAniConRepo } from './animal-consulta-intf';
import { AniConRepoOrm } from './animal-consulta-orm';


let mysql: boolean = true;

// Função GET 
export function getRepoAniCon(): IAniConRepo {

    if (mysql === true) {
        return new AniConRepoOrm();
    } else {
        throw new Error('Erro ao carregar ORM')
    }
};
