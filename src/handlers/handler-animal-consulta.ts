
// Dependencias
import { Request, Response } from "express";
import { getRepoAnimal } from "../repo/animal-repo/repo-animal-factory";
import { Animal } from "../models/model-animal";
import { connection } from "../database/sql-connection";
import { LAST_ID_QUERY } from "../repo/animal-repo/repo-animal-intf";
import { getRepoAniCon } from "../repo/animal-consulta-repo/animal-consulta-factory";
import { AniCon } from "../models/model-animal-consulta";

export const AniConHandler = {
    // Handler para GET
    getHandler: async (req: Request, res: Response) => {
        try {
            const arrAnimalConsulta = await getRepoAniCon().getAll();
            res.json({ 'Consultas e Animais': arrAnimalConsulta });
        } catch (error) {
            console.error('Error', error);
            res.status(500).send('Erro interno')
        }
    },

    // Handler GET ID
    getIdHandler: async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        const id = req.params.id;
        try {
            const idParaNumero = Number(id)
            if (isNaN(idParaNumero)) {
                return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
            }
            const oneAnimal = await getRepoAniCon().getOne({
                id: idParaNumero,
                consulta: undefined,
                animal: undefined
            })
            console.log(oneAnimal)
            if (oneAnimal) {
                res.status(200).json(oneAnimal);
            } else {
                res.status(404).send('Relação com esse ID não encontrada. Envie um ID válido.')
            }

        } catch (error) {
            console.log('Erro pegando por ID', error);
            return res.status(500).send('Erro interno');
        }
    },


    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }
        const { consulta, animal } = req.body

        if (!consulta && !animal) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }
        const novoAniCon = new AniCon(consulta, animal);
        
        try {
            await getRepoAniCon().saveOne(novoAniCon);
            const [lastInsertId] = await connection.promise().query(LAST_ID_QUERY)
            res.status(200).json({lastInsertId,novoAniCon });

        } catch (error) {
            console.log('Erro aqui', error);
            return res.status(400).send('Erro ao criar uma consulta com animal')

        }
    },

    // Handlers para PUT
    putHandler: async (req: Request, res: Response) => {

        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        const id = req.params.id
        const idToNumber = Number(id)
        if (isNaN(idToNumber)) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido')
        };
        const { consulta, animal } = req.body;

        const atualizaAniCon = new AniCon(consulta, animal);
        atualizaAniCon.id = idToNumber;

        if (consulta && animal) {
            try {
                const putAnimal = await getRepoAniCon().saveOne(atualizaAniCon);
                if (putAnimal !== null) {
                    res.status(200).json('Atualizado com sucesso!');
                } else {
                    res.status(400).send('Erro ao atualizar, utilize um ID válido.');
                }
            } catch (error) {
                console.log('erro ao atualizar:', error);
                return res.status(500).send('Erro interno: ' + error.message);
            }
        } else {
            res.status(400).send('Todos os campos devem ser preenchidos')
        }

    },

    // Handlers para DELETE
    deleteHandler: async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        const id = req.params.id
        const idToNumber = Number(id)
        if (isNaN(idToNumber)) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
        }

        try {
            const delAni = await getRepoAniCon().delete(idToNumber)
            if (delAni.successo === true) {
                res.status(200).send('Relação deletada com sucesso.');

            } else if (delAni.successo === false) {
                res.status(400).send('Nenhuma Relação encontrada com esse ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhuma Relação encontrada com esse ID')
        }
    }
};

