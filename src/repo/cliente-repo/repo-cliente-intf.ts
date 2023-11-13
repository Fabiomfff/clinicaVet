
/*
* Interface relacionada a Cliente
*
*/
import { Cliente } from "../../models/model-cliente";

export const ERR_REPOCLI_EMAIL_JA_EXITE: string = 'O email já está registrado em outro cliente.';
export const CLI_LAST_ID_QUERY: string = 'SELECT LAST_INSERT_ID() AS id'

export interface IClienteRepo {

    getCliAll(): Promise<Cliente[]>;
    
    getCli(ACli: Cliente): Promise<Cliente>;

    saveCli(ACli: Cliente): Promise<Cliente>;

    deleteCli(AId: Number): Promise<{ successo: Boolean}>;

};