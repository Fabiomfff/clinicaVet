import { appDataSource } from "../../database/sql-connection";
import { EEspecie } from "../../entities/entitity-especie";
import { Especie } from "../../models/model-especie";
import { IEspecieRepo } from "./repo-especie-intf";

const especieRepository = appDataSource.getRepository(EEspecie);

export class EspecieRepoOrm implements IEspecieRepo {

    public getEspAll = async (): Promise<EEspecie[]> => {
        try {
            const getAll = await especieRepository.find()

            console.log(getAll)
            return getAll as EEspecie[]
        } catch (error) {
            console.log(error)
        };
    };

    public getEsp = async (AEsp: EEspecie): Promise<EEspecie> => {
        try {
            const getOne = await especieRepository.findBy({ id: AEsp.id })
            return getOne[0] as EEspecie
        } catch (error) {
            console.log(error)
        };
    };

    public saveEsp = async (AEsp: EEspecie): Promise<Especie> => {
        if (AEsp.id > 0) {
            return await this.atualizarEsp(AEsp)
        } else {
            return await this.inserirEsp(AEsp)
        };
    };

    private inserirEsp = async (AEsp: EEspecie): Promise<Especie> => {
        try {
            const create = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EEspecie)
                .values([
                    { id: AEsp.id, tipo: AEsp.tipo, desc: AEsp.desc }
                ])
                .execute()
            console.log(create)
            return create[0] as EEspecie;

        } catch (error) {
            console.log(error)
        };
    };

    private atualizarEsp = async (AEsp: EEspecie): Promise<Especie> => {
        if (AEsp.id < 1) {
            throw ('ID da Especie não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(EEspecie)
                .set({
                    tipo: AEsp.tipo,
                    desc: AEsp.desc
                })
                .where({ id: AEsp.id })
                .execute();

            console.log(results)
            if (results.affected === 1) {
                console.log('Especie atualizado com sucesso');

                return AEsp as EEspecie;
            } else {
                console.log('Nenhuma Especie com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteEsp = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteEspecie() {
            try {
                const deleteResult = await especieRepository.delete(AId);

                if (deleteResult.affected === 1) {
                    console.log(`esp_id: ${AId} deletado com sucesso.`)
                    return { successo: true };
                } else {
                    console.log(`esp_id: ${AId} não encontrado.`);
                    return { successo: false };
                }
            } catch (error) {
                console.error("An error occurred:", error);
                return { successo: false };
            }
        }
        return deleteEspecie()
    };
}


