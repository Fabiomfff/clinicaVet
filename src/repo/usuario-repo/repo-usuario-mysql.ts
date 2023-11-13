
import { connection } from '../../database/sql-connection';
import { ResultSetHeader } from 'mysql2'
import { Usuario } from '../../models/model-usuarios';
import { ERR_REPOUSU_LOGIN_JA_EXITE, IUsuarioRepo } from './repo-usuario-intf';

export class UsuarioRepoHardcoded implements IUsuarioRepo {

    // Get Method
    public getUsuAll = async (): Promise<Usuario[]> => {
        const _getAllQuery = 'SELECT usu_id, usu_login FROM usuarios';
        try {
            const [rows, fields] = await connection.promise().query(_getAllQuery);
            console.log('Qry:', rows);
            let results: Usuario[];
            results = [];
            //@ts-ignore
            rows.map(
                (usuario: any) => {
                    const instance: Usuario = new Usuario(usuario.usu_login, usuario.usu_senha)
                    instance.id = usuario.usu_id;
                    results.push(instance);
                }
            )
            return results;

        } catch (error) {
            console.log(error);
        }
    }
    //Get
    public getUsu = async (AUsu: Usuario): Promise<Usuario> => {
        const _getQuery = 'SELECT usu_login FROM usuarios WHERE usu_id = ' + AUsu.id;
        try {
            const [rows, fields] = await connection.promise().query(_getQuery);
            console.log('Qry:', rows);
            let results: Usuario[] = [];
            //@ts-ignore
            rows.map(
                (usuario: any) => {
                    const instance: Usuario = new Usuario(usuario.usu_login, usuario.usu_senha);
                    instance.id = usuario.usu_id;
                    results.push(instance);
                }
            )
            return results[0];

        } catch (error) {
            console.log(error);
        }
    };

    public saveUsu = async (AUsu: Usuario): Promise<Usuario> => {
        if (AUsu.id > 0) {
            return await this.atualizarUsu(AUsu)
        } else {
            return await this.inserirUsu(AUsu)
        }
    };

    private inserirUsu = async (AUsu: Usuario): Promise<Usuario> => {
        const _query =
            'INSERT INTO ' +
                ' usuarios  ' +
            ' SET ' +
                ' usu_login = "' + AUsu.login + '", ' +
                ' usu_senha = "' + AUsu.senha + '"'
            ;
        try {
            const [create] = await connection.promise().query<ResultSetHeader>(_query)
            console.log(create)
            
            const [Lastinsertid] = await connection.promise().query('SELECT LAST_INSERT_ID() AS id')
            return Lastinsertid && create[0] as Usuario;

        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_usu_login'))
            ) {
                console.log('Erro aqui.', error)
                throw new Error(ERR_REPOUSU_LOGIN_JA_EXITE);
            }
            throw error;
        }
    };

    private atualizarUsu = async (AUsu: Usuario): Promise<Usuario> => {
        if (AUsu.id < 1) {
            throw ('ID do usuario não preenchido.');
        };

        const _putQuery =
                'UPDATE usuarios ' +
            'SET ' +
                'usu_login = "' + AUsu.login + '", ' +
                'usu_senha = "' + AUsu.senha + '" ' +
            'WHERE usu_id = "' + AUsu.id.toString() +'"'

        try {
            const [results] = await connection.promise().query<ResultSetHeader>(_putQuery);

            if (results.info.includes('Rows matched: 1')) {
                console.log('Animal atualizado com sucesso');

                return  results[0] as Usuario;
            } else {
                console.log('Nenhum Animal com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            if (
                (error.sqlMessage.includes('Duplicate'))
                &&
                (error.sqlMessage.includes('idx_adm_login'))
            ) {
                throw new Error(ERR_REPOUSU_LOGIN_JA_EXITE);
            }
            throw error;
        };
    };

    public deleteUsu = async (AId: number): Promise<{ successo: Boolean }> => {
        const _delQuery =
            'DELETE FROM ' +
                ' usuarios ' +
            ' WHERE ' +
                ' usu_id = "' + AId + '"';

        try {
            const results = await connection.promise().query<ResultSetHeader>(_delQuery);
            console.log(results);

            if (results[0] && results[0].affectedRows === 1) {
                console.log('Usuario deletado com sucesso')
                return { successo: true };

            } else if (results[1] === undefined) {
                console.log('Nenhum Usuario1 com esse ID.')
                return { successo: false };
            };
        } catch (error) {
            if (error.message == 'TypeError: Cannot read properties of undefined')
                return { successo: false };
        };
    }
};
