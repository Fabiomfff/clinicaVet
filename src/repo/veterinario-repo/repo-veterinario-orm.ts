import { appDataSource } from "../../database/sql-connection";
import { EVeterinario } from "../../entities/entitity-veterinario";
import { Veterinario } from "../../models/model-veterinario";
import { IVeterinarioRepo } from "./repo-veterinario-intf";


const VeterinarioRepository = appDataSource.getRepository(EVeterinario);

export class VeterinarioRepoOrm implements IVeterinarioRepo  {

    public getVetAll = async (): Promise<EVeterinario[]> => {
        try {
            const getAll = await VeterinarioRepository.find();

            console.log(getAll)
            return getAll as EVeterinario[]
        } catch (error) {
            console.log(error)
        };
    };

    public getVet = async (AVet: EVeterinario): Promise<EVeterinario> => {
        try {
            const getOne = await VeterinarioRepository.findBy({ id: AVet.id })
            console.log( getOne)

            return getOne[0] as EVeterinario
        } catch (error) {
            console.log(error)
        };
    };

    public saveVet = async (AVet: Veterinario): Promise<Veterinario> => {
        if (AVet.id > 0) {
            return await this.atualizarVet(AVet)
        } else {
            return await this.inserirVet(AVet)
        };
    };

    private inserirVet = async (AVet: Veterinario): Promise<EVeterinario> => {
        try {
            const create = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EVeterinario)
                .values([
                    { id: AVet.id, nome: AVet.nome, email: AVet.email, crmv: AVet.crmv }
                ])
                .execute()
            console.log('codigo create: ', create)
            return create[0] as EVeterinario;

        } catch (error) {
            if (error.sqlMessage.includes('Duplicate entry')) {
                console.log(error)
                throw new Error('crmv já existe!')
            }

        };
    };

    private atualizarVet = async (AVet: EVeterinario): Promise<Veterinario> => {
        if (AVet.id < 1) {
            throw ('ID do veterinario não preenchido.');
        };

        try {
             const results = await appDataSource
                .createQueryBuilder()
                .update(EVeterinario)
                .set({
                    nome: AVet.nome,
                    email: AVet.email,
                    crmv: AVet.crmv
                })
                .where({ id: AVet.id })
                .execute();

            console.log("resultados atualizar vet" , results)
            if (results.affected === 1) {
                console.log('Veterinario atualizado com sucesso');
                return AVet as EVeterinario;

            } else {
                console.log('Nenhum veterinario com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteVet = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteVeterinario() {
            try {
                const deleteResult = await VeterinarioRepository.delete(AId);

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
        return deleteVeterinario()
    };
}


