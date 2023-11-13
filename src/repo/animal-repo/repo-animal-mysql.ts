/*
* mysql comands for Animal
*
*/

import { IAnimalRepo,  LAST_ID_QUERY } from './repo-animal-intf';
import { connection } from '../../database/sql-connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2'

import { Animal } from '../../models/model-animal';
import { Especie } from '../../models/model-especie';
import { Cliente } from '../../models/model-cliente';
import { Usuario } from '../../models/model-usuarios';
import { error } from 'console';

export class AnimalRepoHardcoded implements IAnimalRepo {

    // Get Method
    public getAniAll = async (): Promise<Animal[]> => {
        const _getAllQuery =
            'SELECT animal.*, especie.*, cliente.*, usuarios.usu_id , usuarios.usu_login ' +
            'FROM animal ' +
            'LEFT JOIN especie ON ' +
            '   animal.ani_esp_id = especie.esp_id ' +
            'LEFT JOIN cliente ON ' +
            '   animal.ani_cli_id = cliente.cli_id' +
            ' LEFT JOIN usuarios ON ' +
                ' animal.ani_log_user = usuarios.usu_id';

        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Animal[] = [];
            //@ts-ignore
            rows.map((dados: any) => {

                const cliente = new Cliente(dados.cli_nome, dados.cli_telefone, dados.cli_email);
                cliente.id = dados.cli_id
                const especie = new Especie(dados.esp_tipo, dados.esp_desc);
                especie.id = dados.esp_id
                const usuario = new Usuario(dados.usu_login, dados.usu_id)
                const instance: Animal = new Animal(dados.ani_nome, dados.ani_nasc, usuario, cliente, especie);
                instance.id = dados.ani_id;
                instance.log_em = dados.ani_log_em

                results.push(instance);
            });

            return results;
        } catch (error) {
            if (error.sqlMessage.includes('Incorrect date value')) {
                console.log('Erro ao adicionar data, use o formato YYYY-MM-DD')
            }
            console.log(error);
        }
    }


    //GetAni
    public getAni = async (AAni: Animal): Promise<Animal> => {
        const _getQuery =
            'SELECT animal.*, especie.*, cliente.*, usuarios.usu_id , usuarios.usu_login ' +
            'FROM animal ' +
            'LEFT JOIN especie ON ' +
            '   animal.ani_esp_id = especie.esp_id ' +
            'LEFT JOIN cliente ON ' +
            '   animal.ani_cli_id = cliente.cli_id' +
            ' LEFT JOIN usuarios ON ' +
                ' animal.ani_log_user = usuarios.usu_id '
            ' WHERE ' +
                ' ani_id =' + AAni.id;
        
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Animal[] = [];
            //@ts-ignore
            rows.map(
                (dados: any) => {
                    
                    const cliente = new Cliente(dados.cli_id, dados.cli_nome, dados.cli_email);
                    const usuario = new Usuario(dados.usu_login, dados.usu_senha);
                    delete usuario.senha;
                    const especie = new Especie(dados.esp_id, dados.esp_desc);  
                    const animal: Animal = new Animal(dados.ani_nome, dados.ani_nasc, usuario, cliente, especie);
                    animal.id = dados.ani_id;

                    const instanceOrdered = []

                    results.push(animal);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };

     public saveAni = async (AAni: Animal): Promise<Animal> => {
         if (AAni.id > 0) {
             return await this.atualizarAni(AAni)
        } else {
             return await this.inserirAni(AAni)
         }
     };

    private inserirAni = async (AAni: Animal): Promise<Animal> => {
        const _query =
            'INSERT INTO ' +
                ' animal  ' +
            ' SET ' +
                ' ani_nome     = "' + AAni.nome + '", ' +
                ' ani_nasc     = "' + AAni.nasc + '", ' +
                ' ani_log_em   = CURRENT_TIMESTAMP(),' +
                ' ani_log_user = "' + AAni.usuario + '", ' +
                ' ani_cli_id   = "' + AAni.dono + '", ' +
                ' ani_esp_id   = "' + AAni.especie + ' " '
            ;        
        
        try {
            const [create] = await connection.promise().query<ResultSetHeader>(_query)
            console.log(create)
            const [Lastinsertid] = await connection.promise().query(LAST_ID_QUERY)
            return Lastinsertid && create[0] as Animal; 

        } catch (error) {
            console.log(error, 'erro ao criar um animal novo.')
        }
    };

    private atualizarAni = async (AAni: Animal): Promise<Animal>=> {
        if (AAni.id < 1) {
            throw ('ID do Animal não preenchido.');
        };
        const _putQuery =
            'UPDATE ' +
                ' animal  ' +
            ' SET ' +
                ' ani_nome     = "' + AAni.nome + '", ' +
                ' ani_nasc     = "' + AAni.nasc + '", ' +
                ' ani_log_em   =  CURRENT_TIMESTAMP(), ' +
                ' ani_log_user = "' + AAni.usuario + '", ' +
                ' ani_cli_id   = "' + AAni.dono + '", ' +
                ' ani_esp_id   = "' + AAni.especie + ' " ' +
            ' WHERE ani_id = ' + AAni.id.toString();

        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);
            console.log(results)

            if (results.info.includes('Rows matched: 1')) {
                console.log('Animal atualizado com sucesso');
                return results[0] as Animal;
            } else {
                console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                return null;
            }
            
        } catch (error) {
            if (!error.message.includes('Animal atualizado com sucesso')) {
                console.log(error)
                return new error;    
            }
            throw error
        };
    };

    public deleteAni = async (AId: Number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
              ' animal ' +
            ' WHERE ' +
                ' ani_id = "' + AId + '"';

        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery);
            console.log(results);

            if (results[0] && results[0].affectedRows === 1) {
                console.log('Animal deletado com sucesso')
                return { successo: true };

            } else if (results[1] === undefined) {
                console.log('Nenhum Animal com esse ID.')
                return { successo: false };
            };
        } catch (error) {
            if (error.message == 'TypeError: Cannot read properties of undefined')
                return { successo: false };
        };
    }
};
