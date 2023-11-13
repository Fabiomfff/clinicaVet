import { appDataSource } from "../../database/sql-connection";
import { ELogin } from "../../entities/entitty-login";
import { Login } from "../../models/model-login";
import { ILoginRepo } from "./repo-login-intf";

const loginRepository = appDataSource.getRepository(ELogin)

export class LoginRepoOrm implements ILoginRepo {
    public Login = async (ALog: Login): Promise<Login> => {
        try {
            const VerificaLogin = await loginRepository.findOne({
                where: { login: ALog.login, senha: ALog.senha },
            });
            return VerificaLogin as Login
        } catch (error) {
            console.log(error)
        }

    }
}