import { ResultSetHeader } from "mysql2";
import { connection } from "../../database/sql-connection";
import { Especie } from "../../models/model-especie";
import { IEspecieRepo } from "./repo-especie-intf";



export class EspecieRepoHardcoded implements IEspecieRepo {

    // Get Method
    public getEspAll = async (): Promise<Especie[]> => {
        const _getAllQuery = 'SELECT * FROM especie';
        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Especie[] = [];
            //@ts-ignore
            rows.map(
                (especie: any) => {
                    const instance: Especie = new Especie(especie.esp_tipo, especie.esp_desc);
                    instance.id = especie.esp_id;
                    results.push(instance);
                }
            )
            return results;

        } catch (error) {
            console.log(error);
        }
    };

    //Get One Esp
    public getEsp = async (AEsp: Especie): Promise<Especie> => {
        const _getQuery = 'SELECT * FROM especie WHERE esp_id =  ' + AEsp.id.toString();
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Especie[] = [];
            //@ts-ignore
            rows.map(
                (especie: any) => {
                    const instance: Especie = new Especie(especie.esp_tipo, especie.esp_desc);
                    instance.id = especie.esp_id;
                    results.push(instance);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };
    

    public saveEsp = async (AEsp: Especie): Promise<Especie> => {
        if (AEsp.id > 0) {
            return await this.atualizarEsp(AEsp)
        } else {
            return await this.inserirEsp(AEsp)
        }
    };
    // Post Method
    public inserirEsp = async (AEsp: Especie): Promise<Especie> => {

        const _query =
            'INSERT INTO ' +
                ' especie  ' +
            ' SET ' +
                ' esp_tipo = "' + AEsp.tipo + '", ' +
                ' esp_desc = "' + AEsp.desc + '" '
            ;
        try {

            await connection.promise().query(_query)
            const [results] = await connection.promise().query('SELECT * FROM especie WHERE esp_id = LAST_INSERT_ID() ');
            return results[0] as Especie;

        } catch (error) {
            console.log(error);
        }
    };

    // PUT method 
    
    public atualizarEsp = async (AEsp: Especie): Promise<Especie> => {
        if (AEsp.id < 1) {
            throw ('ID da especie não preenchida.');
        };

        const _putQuery =
            'UPDATE ' +
                ' especie  ' +
            ' SET ' +
                ' esp_tipo = "' + AEsp.tipo + '", ' +
                ' esp_desc = "' + AEsp.desc + '" ' +
            'WHERE ' +
                'esp_id = " ' + AEsp.id + ' "';

        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);

            if (results.info.includes('Rows matched: 1')) {
                console.log('Animal atualizado com sucesso');

                if (results.info.includes('Rows matched: 1')) {
                    console.log('Animal atualizado com sucesso');
                    return results[0] as Especie;
                } else {
                    console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                    return null;
                }
            } else {
                console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                return null;
            }
            

        } catch (error) {
            console.log(error);
        }
    };


    public deleteEsp = async (AId: number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
                ' especie ' +
            ' WHERE ' +
                ' esp_id = ' + AId;
        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery);
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
        };
    }     
};