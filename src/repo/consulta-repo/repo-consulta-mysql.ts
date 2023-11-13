import { ResultSetHeader } from "mysql2";
import { connection } from "../../database/sql-connection";
import { IConsultaRepo } from "./repo-consulta-intf";
import { Consulta } from "../../models/model-consulta";

export class ConsultaRepoHardCoded implements IConsultaRepo {

    // Get Method
    public getConAll = async (): Promise<Consulta[]> => {
        const _getAllQuery = 'SELECT * FROM consulta';
        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Consulta[] = [];
            //@ts-ignore
            rows.map(
                (consulta: any) => {
                    const instance: Consulta = new Consulta(consulta.con_diagnostico, consulta.con_remedio, consulta.con_vet_id, consulta.con_ani_id);
                    instance.id = consulta.con_id;
                    results.push(instance);
                }
            )
            return results;

        } catch (error) {
            console.log(error);
        }
    };

    //Get One con
    public getCon = async (ACon: Consulta): Promise<Consulta> => {
        const _getQuery = 'SELECT * FROM consulta WHERE con_id =  ' + ACon.id.toString();
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Consulta[] = [];
            //@ts-ignore
            rows.map(
                (consulta: any) => {
                    const instance: Consulta = new Consulta(consulta.con_diagnostico, consulta.con_remedio, consulta.con_vet_id, consulta.con_ani_id);
                    instance.id = consulta.con_id;
                    results.push(instance);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };


    public saveCon = async (ACon: Consulta): Promise<Consulta> => {
        if (ACon.id > 0) {
            return await this.atualizarCon(ACon)
        } else {
            return await this.inserirCon(ACon)
        }
    };
    // Post Method
    public inserirCon = async (ACon: Consulta): Promise<Consulta> => {

        const _query =
            'INSERT INTO ' +
                ' consulta  ' +
            ' SET ' +
                ' con_diagnostico = "' + ACon.diagnostico + '", ' +
                ' con_remedio = "' + ACon.remedio + '", ' +
                ' con_vet_id = " ' + ACon.veterinario + ' ", ' +
                ' con_ani_id = " ' + ACon.animal + ' " '
            ;
        try {

            await connection.promise().query(_query);
            const [results] = await connection.promise().query('SELECT * FROM consulta WHERE con_id = LAST_INSERT_ID() ');
            return results[0] as Consulta;

        } catch (error) {
            console.log(error);
        }
    };

    // PUT method 

    public atualizarCon = async (ACon: Consulta): Promise<Consulta> => {
        if (ACon.id < 1) {
            throw ('ID da consulta não preenchida.');
        };

        const _putQuery =
            'UPDATE ' +
                ' consulta  ' +
            ' SET ' +
                ' con_diagnostico = "' + ACon.diagnostico + '", ' +
                ' con_remedio = "' + ACon.remedio + '", ' +
                ' con_vet_id = " ' + ACon.veterinario + ' " ' +
                ' con_ani_id = " ' + ACon.animal + ' " ' +
            'WHERE ' +
                'con_id = " ' + ACon.id + ' "'
            ;
        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);
            console.log(results);

            if (results.info.includes('Rows matched: 1')) {
                console.log('Consulta atualizado com sucesso');

                if (results.info.includes('Rows matched: 1')) {
                    console.log('Consulta atualizado com sucesso');
                    return results[0] as Consulta;
                } else {
                    console.log('Nenhum Consulta com esse ID foi encontrado ou atualizado.');
                    return null;
                }
            } else {
                console.log('Nenhum Consulta com esse ID foi encontrado ou atualizado.');
                return null;
            }


        } catch (error) {
            console.log(error);
        }
    };


    public deleteCon = async (AId: number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
                ' consulta ' +
            ' WHERE ' +
                ' con_id = ' + AId
            ;
        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery);
            console.log(results);

            if (results[0] && results[0].affectedRows === 1) {
                console.log('Consulta deletado com sucesso');
                return { successo: true };

            } else if (results[1] === undefined) {
                console.log('Nenhuma Consulta com esse ID.');
                return { successo: false };
            };
        } catch (error) {
            if (error.message == 'TypeError: Cannot read properties of undefined')
                return { successo: false };
        };
    }
};