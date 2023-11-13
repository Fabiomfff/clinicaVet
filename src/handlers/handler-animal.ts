/*
* handlers para Animais
*
*/

// Dependencias
import { Request, Response } from "express";
import { getRepoAnimal } from "../repo/animal-repo/repo-animal-factory";
import { Animal } from "../models/model-animal";
import { connection } from "../database/sql-connection";
import { LAST_ID_QUERY } from "../repo/animal-repo/repo-animal-intf";

export const animalHandler = {
    // Handler para GET
    getHandler:async(req: Request, res: Response) => {
        try {
            const arrAnimais = await getRepoAnimal().getAniAll();
            res.json({'Animais': arrAnimais});
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
            const animal = await getRepoAnimal().getAni({
                id: idParaNumero,
                log_em: undefined,
                nome: undefined,
                nasc: undefined,
                usuario: undefined,
                dono: undefined,
                especie: undefined
            })

            if (animal) {
                res.status(200).json(animal);
            } else {
                res.status(404).send('Animal com esse ID não encontrado. Envie um ID válido.')
            }

        } catch (error) {
            console.log('Erro pegando Animal por ID', error);
            return res.status(500).send('Erro interno');
        }
    },


    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }

        const { nome, nasc, dono, especie, usuario } = req.body


        if (!nome && !nasc && !dono && !especie  && !usuario) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }

        const nascOrdem = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        const nascValue = req.body.nasc;

        if (!nascOrdem.test(nascValue)) {
            return res.status(400).json('Formato de data inválido. Utilize o formato AAAA-MM-DD com um dia e mês válidos.')
        }

            // Create instances of the required models
            const novoAnimal = new Animal(nome, nasc,usuario, dono, especie);
    

         try {
             await getRepoAnimal().saveAni(novoAnimal);
             const [lastInsertId] = await connection.promise().query(LAST_ID_QUERY)
             res.status(200).json({ novoAnimal });

         } catch (error) {
             if (error.sqlMessage.includes('Cannot add or update a child row:')) {
                 return res.json('Erro ao adicionar id de outras tabelas')
             }
            console.log('Erro aqui', error);
            return res.status(400).send('Erro ao criar animal')

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
        const { nome, nasc, usuario, dono, especie } = req.body;

        const atualizaAnimal = new Animal(nome, nasc, usuario, dono, especie);
        atualizaAnimal.id = idToNumber;

        if (nome && nasc && usuario && dono && especie) {
            try {
                const putAnimal = await getRepoAnimal().saveAni(atualizaAnimal);
                if (putAnimal !== null) {
                    res.status(200).json('Animal atualizado com sucesso!');
                } else {
                    res.status(400).send('Erro ao atualizar, utilize um ID válido.');
                }
            } catch (error) {
                console.log('erro ao atualizar animal:', error);
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
            const delAni = await getRepoAnimal().deleteAni(idToNumber)
            if (delAni.successo === true) {
                res.status(200).send('animal deletado com sucesso.');

            } else if (delAni.successo === false) {
                res.status(400).send('Nenhum animal encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum animal encontrado com o ID')
        }
    }
};

