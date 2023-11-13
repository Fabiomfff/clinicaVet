import { appDataSource } from "../../database/sql-connection";
import { ECliente } from "../../entities/entitiy-cliente";
import { EAnimal } from "../../entities/entity-animal";
import { Animal } from "../../models/model-animal";
import { Cliente } from "../../models/model-cliente";
import { IAnimalRepo } from "./repo-animal-intf";


const animalRepository = appDataSource.getRepository(EAnimal);

export class AnimalRepoOrm implements IAnimalRepo {

    public getAniAll = async (): Promise<Animal[]> => {
        try {
            const getAll = await animalRepository.find({
                relations: {
                    especie: true,
                    usuario: true,
                    dono: true
                },

            })

            console.log(getAll)
            return getAll as Animal[]
        } catch (error) {
            console.log(error)  
        };
    };

    public getAni = async (AAni: Animal): Promise<Animal> => {
        try {
            const getOne = await animalRepository.findOne({
                where: {
                    id: AAni.id
                },
                relations: {
                    dono: true,
                    especie: true,
                    usuario: true}
                });
            return getOne as Animal;
        } catch (error) {
            console.log(error);
        };
    };


    public saveAni = async (AAni: Animal): Promise<Animal> => {
        if (AAni.id > 0) {
            return await this.atualizarAni(AAni);
        } else {
            return await this.inserirAni(AAni);
        }
    };

    private inserirAni = async (AAni: Animal): Promise<Animal> => {
        try {
            const result = await appDataSource
                .createQueryBuilder()
                .insert()
                .into(EAnimal)
                .values([
                    {
                        nome: AAni.nome,
                        nasc: AAni.nasc,
                        usuario: AAni.usuario,
                        especie: AAni.especie,
                        dono: AAni.dono
                    }
                ])
                .execute()
            ;

            console.log(result);
            return result[0] as Animal;

        } catch (error) {
            console.log('Erro ao criar animal', error);
        };
    };
    private atualizarAni = async (AAni: Animal): Promise<Animal> => {
        if (AAni.id < 1) {
            throw ('ID do cliente não preenchido.');
        };

        try {
            const results = await appDataSource
                .createQueryBuilder()
                .update(EAnimal)
                .set({
                        nome: AAni.nome,
                        nasc: AAni.nasc,
                        usuario: AAni.usuario,
                        especie: AAni.especie,
                        dono: AAni.dono
                    })
                .where({ id: AAni.id })
                .execute()
            ;
            console.log(results);
            if (results.affected === 1) {
                console.log('Cliente atualizado com sucesso');
                return results[1] as Animal;
            } else {
                console.log('Nenhum cliente com esse ID foi encontrado ou atualizado.');
                return null;
            }
        } catch (error) {
            console.log(error)
        };
    };

    public deleteAni = async (AId: number): Promise<{ successo: Boolean }> => {
        async function deleteCliente() {
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
        return deleteCliente()
    };
}
