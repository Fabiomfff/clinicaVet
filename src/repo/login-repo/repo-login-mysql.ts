import { ResultSetHeader, RowDataPacket } from "mysql2";
import { connection } from "../../database/sql-connection";
import { Login } from "../../models/model-login";
import { ILoginRepo } from "./repo-login-intf";


export class LoginRepoHardcoded implements ILoginRepo {
    public Login = async (ALog: Login): Promise<Login | null> => {
        const _query =
            'SELECT * FROM usuarios WHERE usu_login = \'' + ALog.login + '\' AND usu_senha = \'' + ALog.senha + '\'';
        try {
            const [results] = await connection.promise().query<RowDataPacket[]>(_query);
            console.log(results);

            if (results.length > 0) {
                return results[0] as Login;
            } else {
                return null;
            }
        } catch (error) {
            if (error.sqlMessage.includes('You have an error in your SQL syntax')) {
                console.log('Erro, Login invalido', error)
            }
            console.log(error);
            return error;
        }
    }
}
