import { appDataSource } from "../../database/sql-connection";
import { ECliente } from "../../entities/entitiy-cliente";
import { Cliente } from "../../models/model-cliente";
import { ERR_REPOCLI_EMAIL_JA_EXITE, IClienteRepo } from "./repo-cliente-intf";


const clienteRepository = appDataSource.getRepository(ECliente);

export class ClienteRepoOrm implements IClienteRepo {

    public getCliAll = async (): Promise<ECliente[]> => {
        try {
            const getAll = await clienteRepository.find()

            console.log(getAll)
            return getAll as ECliente[]
        } catch (error) {
            console.log(error)
        };
    };

    public getCli = async (ACli: ECliente): Promise<ECliente> => {
        try {
            const getOne = await clienteRepository.findBy({ id: ACli.id })
            return getOne[0] as ECliente
        } catch (error) {
            console.log(error)
        };
    };

    public saveCli = async (ACli: Cliente): Promise<Cliente> => {
        if (ACli.id > 0) {
            return await this.atualizarCli(ACli)
        } else {
            return await this.inserirCli(ACli)
        };
    };

    private inserirCli = async (ACli: Cliente): Promise<ECliente> => {
        try {
            const create = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(ECliente)
                .values([
                    { id: ACli.id, nome: ACli.nome, email: ACli.email, telefone: ACli.telefone }
                ])
                .execute()
            console.log(create)
            return create[0] as ECliente;

        } catch (error) {
            if (error.sqlMessage.includes('Duplicate entry')) {
                console.log(error)                
                throw new Error(ERR_REPOCLI_EMAIL_JA_EXITE)
            }

        };
    };

    private atualizarCli = async (ACli: Cliente): Promise<Cliente> => {
        if (ACli.id < 1) {
            throw ('ID do cliente não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(ECliente)
                .set({
                    nome: ACli.nome,
                    email: ACli.email,
                    telefone: ACli.telefone
                })
                .where({ id: ACli.id })
                .execute();

            console.log(results)
            if (results.affected === 1) {
                console.log('Cliente atualizado com sucesso');

                return ACli as Cliente;
            } else {
                console.log('Nenhum cliente com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteCli= async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteCliente() {
            try {
                const deleteResult = await clienteRepository.delete(AId);

                if (deleteResult.affected === 1) {
                    console.log(`id: ${AId} deletado com sucesso.`)
                    return { successo: true };
                } else {
                    console.log(`id: ${AId} não encontrado.`);
                    return { successo: false };
                }
            } catch (error) {
                console.error("An error occurred:", error);
                return { successo: false };
            }
        }
        return deleteCliente()
    };
}


