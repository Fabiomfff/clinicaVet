import { appDataSource } from "../../database/sql-connection";
import { EUsuario } from "../../entities/entitity-usuario";
import { Usuario } from "../../models/model-usuarios";
import { ERR_REPOUSU_LOGIN_JA_EXITE, IUsuarioRepo } from "./repo-usuario-intf";

const usuarioRepository = appDataSource.getRepository(EUsuario);

export class UsuarioRepoOrm implements IUsuarioRepo {

    public getUsuAll = async (): Promise<Usuario[]> => {
        try {
            const getAll = await usuarioRepository.find()

            console.log(getAll)
            return getAll as Usuario[]
        } catch (error) {
            console.log(error)
        };
    };

    public getUsu = async (AUsu: EUsuario): Promise<Usuario> => {
        try {
            const getOne = await usuarioRepository.findBy({ id: AUsu.id })
            return getOne[0] as EUsuario
        } catch (error) {
            console.log(error)
        };
    };

    public saveUsu = async (AUsu: Usuario): Promise<Usuario> => {
        if (AUsu.id > 0) {
            return await this.atualizarUsu(AUsu)
        } else {
            return await this.inserirUsu(AUsu)
        };
    };

    private inserirUsu = async (AUsu: Usuario): Promise<Usuario> => {
        try {
            const create = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EUsuario)
                .values([
                    { id: AUsu.id, login: AUsu.login, senha: AUsu.senha}
                ])
                .execute()
            console.log(create)
            return create[0] as EUsuario;

        } catch (error) {
            if (error.sqlMessage.includes('Duplicate Entry')) {
                throw new Error(ERR_REPOUSU_LOGIN_JA_EXITE)
            }
        };
    };

    private atualizarUsu = async (AUsu: Usuario): Promise<Usuario> => {
        if (AUsu.id < 1) {
            throw ('ID do usuario não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(EUsuario)
                .set({
                    login: AUsu.login,
                    senha: AUsu.senha
                })
                .where({ id: AUsu.id })
                .execute();
            
                console.log(results)
            if (results.affected === 1) {
                console.log('Usuario atualizado com sucesso');

                return AUsu as Usuario;
            } else {
                console.log('Nenhum Usuario com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteUsu = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteUsuario() {
            try {
                const deleteResult = await usuarioRepository.delete(AId);

                if (deleteResult.affected === 1) {
                    console.log(`usu_id: ${AId} deletado com sucesso.`)
                    return { successo: true };
                } else {
                    console.log(`usu_id: ${AId} não encontrado.`);
                    return { successo: false };
                }
            } catch (error) {
                console.error("An error occurred:", error);
                return { successo: false };
            }
        }
        return deleteUsuario()
    };
}


