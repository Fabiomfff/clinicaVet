import { appDataSource } from "../../database/sql-connection";
import { EAnimal } from "../../entities/entity-animal";
import { EAniCon } from "../../entities/entity-consulta-animais";
import { AniCon } from "../../models/model-animal-consulta";
import { IAniConRepo } from "./animal-consulta-intf";


const animalRepository = appDataSource.getRepository(EAniCon);

export class AniConRepoOrm implements IAniConRepo {

    public getAll = async (): Promise<AniCon[]> => {
        try {
            const getAll = await animalRepository.find({
                relations: {
                    animal: true,
                    consulta: true
                },

            });

            console.log(getAll)
            return getAll as AniCon[]
        } catch (error) {
            console.log(error)
        };
    };

    public getOne = async (AAnc: AniCon): Promise<AniCon> => {
        try {
            const getOne = await animalRepository.findOne({
                where: {
                    id: AAnc.id
                },
                relations: {
                    animal: true,
                    consulta: true
                }
            });
            
            return getOne as AniCon
            
        } catch (error) {
            console.log(error)
        };
    };


    public saveOne = async (AAnc: AniCon): Promise<AniCon> => {
        if (AAnc.id > 0) {
            return await this.atualizar(AAnc)
        } else {
            return await this.inserir(AAnc)
        }
    };

    private inserir = async (AAnc: AniCon): Promise<AniCon> => {
        try {
            const result = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EAniCon)
                .values([
                    {
                        consulta: AAnc.consulta,
                        animal: AAnc.animal,
                    }
                ])
                .execute()
                ;

            console.log(result);
            return result[0] as AniCon;

        } catch (error) {
            if (error.sqlMessage.includes('Cannot add or update a child row')) {
                throw new Error('Erro ao adicionar, id não existe')
            }
        };
    };
    private atualizar = async (AAnc: AniCon): Promise<AniCon> => {
        if (AAnc.id < 1) {
            throw ('ID do cliente não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(EAniCon)
                .set({
                    consulta: AAnc.consulta,
                    animal: AAnc.animal
                })
                .where({ id: AAnc.id })
                .execute();

            console.log(results)
            if (results.affected === 1) {
                console.log('Relação consulta - animal atualizada com sucesso');

                return results[1] as AniCon;
            } else {
                console.log('Nenhuma Relação consulta-animal  com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public delete = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteOne() {
            try {
                const deleteResult = await animalRepository.delete(AId);

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
        return deleteOne()
    };
}
