import { appDataSource } from "../../database/sql-connection";
import { EConsulta } from "../../entities/entity-consulta";
import { Consulta } from "../../models/model-consulta";
import { IConsultaRepo } from "./repo-consulta-intf";

const consultaRepository = appDataSource.getRepository(EConsulta);

export class ConsultaRepoOrm implements IConsultaRepo {

    public getConAll = async (): Promise<Consulta[]> => {
        try {
            const getAll = await consultaRepository.find({
                relations: {
                    veterinario: true,
                    animal: true
                }
            })

            console.log(getAll)
            return getAll as Consulta[]
        } catch (error) {
            console.log(error)
        };
    };

    public getCon = async (ACon: Consulta): Promise<Consulta> => {
        try {
            const getOne = await consultaRepository.findOne({
                where: {
                    id: ACon.id
                },
                relations: {
                    veterinario: true,
                    animal: true
                }
            });
            return getOne[0] as Consulta;
        } catch (error) {
            console.log(error)
        };
    };

    public saveCon = async (ACon: Consulta): Promise<Consulta> => {
        if (ACon.id > 0) {
            return await this.atualizarCon(ACon)
        } else {
            return await this.inserirCon(ACon)
        };
    };

    private inserirCon = async (ACon: Consulta): Promise<Consulta> => {
        try {
            const create = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EConsulta)
                .values([
                    { id: ACon.id, diagnostico: ACon.diagnostico, remedio: ACon.remedio, veterinario: ACon.veterinario }
                ])
                .execute()
            console.log(create)
            return create[0] as Consulta;

        } catch (error) {
            console.log(error)
        };
    };

    private atualizarCon = async (ACon: EConsulta): Promise<Consulta> => {
        if (ACon.id < 1) {
            throw ('ID do Consulta não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(EConsulta)
                .set({
                    diagnostico: ACon.diagnostico,
                    remedio: ACon.remedio,
                    veterinario : ACon.veterinario
                })
                .where({ id: ACon.id })
                .execute();

            console.log(results)
            if (results.affected === 1) {
                console.log('Consulta atualizado com sucesso');

                return results[0] as Consulta;
            } else {
                console.log('Nenhum Consulta com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteCon = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteConsulta() {
            try {
                const deleteResult = await consultaRepository.delete(AId);

                if (deleteResult.affected === 1) {
                    console.log(`con_id: ${AId} deletado com sucesso.`)
                    return { successo: true };
                } else {
                    console.log(`con_id: ${AId} não encontrado.`);
                    return { successo: false };
                }
            } catch (error) {
                console.error("An error occurred:", error);
                return { successo: false };
            }
        }
        return deleteConsulta()
    };
}


