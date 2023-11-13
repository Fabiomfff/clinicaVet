
/*
* Interface relacionada a Animal
*
*/

import { Animal } from '../../models/model-animal';
export const LAST_ID_QUERY: string = 'SELECT LAST_INSERT_ID() AS id'

export interface IAnimalRepo {

    getAniAll(): Promise<Animal[]>;

    getAni(AAni: Animal): Promise<Animal>;

    saveAni(AAni: Animal): Promise<Animal>;

    deleteAni(AId: Number): Promise<{ successo: Boolean }>;

};