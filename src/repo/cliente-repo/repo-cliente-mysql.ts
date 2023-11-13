/*
* mysql comands for Cliente
*
*/

import { Cliente } from '../../models/model-cliente';
import { IClienteRepo, ERR_REPOCLI_EMAIL_JA_EXITE, CLI_LAST_ID_QUERY } from './repo-cliente-intf';
import { connection } from '../../database/sql-connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2'

const connect = connection

export class ClienteRepoHardcoded implements IClienteRepo {
    
    // Get Method
    public getCliAll = async (): Promise<Cliente[]> => {
        const _getAllQuery = 'SELECT * FROM cliente';
        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Cliente[];
            results = [];
            //@ts-ignore
            rows.map(
                (cliente: any) => {
                    const instance: Cliente = new Cliente(cliente.cli_nome, cliente.cli_telefone, cliente.cli_email);
                    instance.id = cliente.cli_id;
                    results.push(instance);
                }
            )
            return results;

        } catch (error) {
            console.log(error);
        }
    };

    //GetCli
    public getCli = async (ACli: Cliente): Promise<Cliente> => {
        const _getQuery = 'SELECT * FROM cliente WHERE cli_id = ' + ACli.id;
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Cliente[] = [];
            //@ts-ignore
            rows.map(
                (cliente: any) => {
                    const instance: Cliente = new Cliente(cliente.cli_nome, cliente.cli_telefone, cliente.cli_email);
                    instance.id = cliente.cli_id;
                    results.push(instance);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };

    public saveCli = async (ACli: Cliente): Promise<Cliente> => {
        if (ACli.id > 0) {
            return await this.atualizarCli(ACli)
        } else {
            return await this.inserirCli(ACli)
        }
    };

    private inserirCli = async (ACli: Cliente): Promise<Cliente> => {
        const _query =
            'INSERT INTO ' +    
            ' cliente  ' +
            ' SET ' +
            ' cli_nome     = "' + ACli.nome + '", ' +
            ' cli_email    = "' + ACli.email + '", ' +
            ' cli_telefone = "' + ACli.telefone + '" ' 
            ;
        try {
            const [create] = await connection.promise().query<ResultSetHeader>(_query)
            console.log(create)
            // create.insertId = ACli.id;
            const [Lastinsertid] = await connection.promise().query(CLI_LAST_ID_QUERY)
            return Lastinsertid && create[0] as Cliente;      
            
        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_cli_email_unico')) 
            ) {
                console.log('Erro aqui.', error)
                 throw new Error(ERR_REPOCLI_EMAIL_JA_EXITE);
            }
             throw error;
        }
    };

    private atualizarCli = async (ACli: Cliente): Promise<Cliente> => {
        if (ACli.id < 1) {
            throw ('ID do cliente não preenchido.');
        };

        const _putQuery =
            'UPDATE cliente ' +
            'SET ' +
            'cli_nome = "' + ACli.nome + '", ' +
            'cli_email = "' + ACli.email + '", ' +
            'cli_telefone = "' + ACli.telefone + '" ' +
            'WHERE cli_id = ' + ACli.id.toString();

        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);


            if (results.info.includes('Rows matched: 1')) {
                console.log('Animal atualizado com sucesso');
                return results[0] as Cliente;
            } else {
                console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                return null;
            }

        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_cli_email_unico'))
            ) {
                throw new Error(ERR_REPOCLI_EMAIL_JA_EXITE);
            }
            throw error;
        };
    };
    
    public deleteCli = async (AId: Number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
                ' cliente ' +
            ' WHERE ' +
                ' cli_id = "' + AId + '"';
        
        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery);
            console.log(results);

            if (results[0] && results[0].affectedRows === 1) {
                console.log('Cliente deletado com sucesso')
                return { successo: true };
                
            } else if (results[1] === undefined) {
                console.log('Nenhum cliente com esse ID.')
                return { successo: false };
            };
        } catch (error) {
            if (error.message == 'TypeError: Cannot read properties of undefined')
                return { successo: false };
        };
    }     
};

 export const clienteTeste = new Cliente( 'fabio', '11950662533', 'fabiom@gmail.com')
