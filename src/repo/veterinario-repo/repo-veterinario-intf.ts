/*
* interface para Veterinario
*
*/

import { Veterinario } from "../../models/model-veterinario";

export const ERR_REPOVET_CRMV_JA_EXISTE = 'O crmv já está registrado em outro Veterinario.';
export const VET_LAST_ID_QUERY: string = 'SELECT LAST_INSERT_ID() AS id'

export interface IVeterinarioRepo { 

    getVetAll(): Promise<Veterinario[]>;
    
    getVet(AVet: Veterinario): Promise<Veterinario>;

    saveVet(AVet: Veterinario): Promise<Veterinario>;

    deleteVet(AId: Number): any;
}