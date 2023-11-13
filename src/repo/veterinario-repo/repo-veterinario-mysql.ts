import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../../database/sql-connection";
import { Veterinario } from "../../models/model-veterinario";
import { ERR_REPOVET_CRMV_JA_EXISTE, IVeterinarioRepo } from "./repo-veterinario-intf";


export class VeterinarioRepoSQL implements IVeterinarioRepo {

    public getVetAll = async (): Promise<Veterinario[]> => {
        const _getAllQuery = 'SELECT * FROM veterinarios';
        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Veterinario[] = [];
            //@ts-ignore
            rows.map(
                (veterinario: any) => {
                    const instance: Veterinario = new Veterinario(veterinario.vet_nome, veterinario.vet_email, veterinario.vet_crmv);
                    instance.id = veterinario.vet_id;
                    results.push(instance);
                }
            )
            return results;

        } catch (error) {
            console.log(error);
        }
    };

    public getVet = async (AVet: Veterinario): Promise<Veterinario> => {
        
        const _getQuery = 'SELECT * FROM veterinarios Where vet_id = ' + AVet.id
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Veterinario[] = [];
            //@ts-ignore
            rows.map(
                (veterinario: any) => {
                    const instance: Veterinario = new Veterinario(veterinario.vet_nome, veterinario.vet_email, veterinario.vet_crmv);
                    instance.id = veterinario.vet_id;
                    results.push(instance);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };



    public saveVet = async (AVet: Veterinario): Promise<Veterinario> => {
        if (AVet.id > 0) {
            return await this.atualizarVet(AVet)
        } else {
            return await this.inserirVet(AVet)
        };
    };

    private inserirVet = async (AVet: Veterinario): Promise<Veterinario> => {

        const _postQuery =
            'INSERT INTO ' +
                ' veterinarios  ' +
            ' SET ' +
                ' vet_nome     = "' + AVet.nome + '", ' +
                ' vet_email    = "' + AVet.email + '", ' +
                ' vet_crmv     = "' + AVet.crmv + '" '
            ;
        try {
            await connection.promise().query(_postQuery)
            const [results] = await connection.promise().query('SELECT * FROM veterinarios WHERE vet_id = LAST_INSERT_ID() ');
            return results[0] as Veterinario;
        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_vet_crmv'))
            ) {
                console.log('Erro aqui.', error)
                throw new Error(ERR_REPOVET_CRMV_JA_EXISTE);
            }
            throw error;
        }
    };

    private atualizarVet = async (AVet: Veterinario): Promise<Veterinario> => {
        if (AVet.id < 1) {
            throw ('ID do cliente não preenchido.');
        };
        const _putQuery =
            'UPDATE IGNORE ' +
                'veterinarios ' +
            'SET ' +
                'vet_nome    = "' + AVet.nome + '", ' +
                'vet_email   = "' + AVet.email + '", ' +
                'vet_crmv    = "' + AVet.crmv + '" ' +
            'WHERE ' +
                'vet_id    = " ' + AVet.id + '" '
            ;
        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);

            if (results.info.includes('Rows matched: 1')) {
                console.log('Animal atualizado com sucesso');
                return AVet as Veterinario;
            } else {
                console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_vet_crmv'))
            ) {
                throw new Error(ERR_REPOVET_CRMV_JA_EXISTE);
            }
            throw error;
        };
    };


    public deleteVet = async (AId: number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
                ' veterinarios ' +
            ' WHERE ' +
                ' vet_id = ' + AId;
        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery)
            console.log(results);

            if (results[0] && results[0].affectedRows === 1) {
                console.log('Especie deletado com sucesso')
                return { successo: true };

            } else if (results[1] === undefined) {
                console.log('Nenhuma especie com esse ID.')
                return { successo: false };
            };
        } catch (error) {
            if (error.message == 'TypeError: Cannot read properties of undefined')
                return { successo: false };
        }
    };
}