/*
*   Repositorio Factory para cliente
*
*/

// Dependencias
import { AnimalRepoHardcoded } from './repo-animal-mysql';
import { IAnimalRepo } from './repo-animal-intf';
import { AnimalRepoOrm } from './repo-animal-orm';


let mysql: boolean = false;

// Função GET 
export function getRepoAnimal(): IAnimalRepo {

    if (mysql === true) {
        return new AnimalRepoHardcoded();
    } else {
        return new AnimalRepoOrm
    }
};
