/*
* handlers para Veterinario
*
*/

import { Response, Request } from 'express';
import { getRepoVeterinario } from '../repo/veterinario-repo/repo-veterinario-factory';
import { Veterinario } from '../models/model-veterinario';
import { connection } from '../database/sql-connection';
import { ResultSetHeader } from 'mysql2';
import { ERR_REPOVET_CRMV_JA_EXISTE, VET_LAST_ID_QUERY } from '../repo/veterinario-repo/repo-veterinario-intf';

// Handler para Veterinario
const veterinarioHandler = {

    // Handler para GET 
    getHandler: async (req: Request, res: Response) => {
        try {
            const getVeterinarios = await getRepoVeterinario().getVetAll();
            res.json(getVeterinarios);
        } catch (error) {
            console.error('Error', error);
            res.status(500).send('Erro interno')
        }
    },

    getOneHandler: async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        const id = req.params.id;

        try {
            const idParaNumero = Number(id)
            if (isNaN(idParaNumero)) {
                return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
            }

            const veterinario = await getRepoVeterinario().getVet({
                id: idParaNumero,
                nome: '',
                email: '',
                crmv: ''
            })

            if (veterinario) {
                return res.status(200).json(veterinario);
            } else {
                return res.status(404).send('Veterinario com esse ID não encontrado. Envie um ID válido.')
            }

        } catch (error) {
            console.log('Erro pegando veterinario por ID', error);
            return res.status(500).send('Erro interno');
        }
    },


    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }

        const { nome, email, crmv } = req.body;

        if (!nome && !email && !crmv) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }

        const trimmedEmail = email.trim();
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json('Formato de email invalido.');
        }

        const allowedDomains = ['hotmail.com', 'gmail.com', 'outlook.com', 'yahoo.com'];
        const emailDomain = trimmedEmail.split('@')[1]; 
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json('Dominio de email não permitido.');
        }

        const regexCRMV = /^[A-Z]+-\d+$/;

        if (regexCRMV.test(crmv)) {
            console.log("CRMV válido.");
        } else {
            console.log("CRMV inválido.");
        }

        if ( !nome && !email && !crmv) {
            res.status(400).send('Error, preencha o formulario corretamente');
        };

        const novoVeterinario = new Veterinario(nome, email, crmv)

        try {
            await getRepoVeterinario().saveVet(novoVeterinario);
            const [lastInsertId] = await connection.promise().query<ResultSetHeader>(VET_LAST_ID_QUERY)
            return res.status(200).json({lastInsertId, novoVeterinario});

        } catch (error) {
            if (Error(ERR_REPOVET_CRMV_JA_EXISTE)) {
                console.error('Erro  criando Veterinario:', error);
                return res.status(400).send('CRMV invalido, tente outro')
            }
            console.error('Erro  criando Veterinario:', error);
            return res.status(500).send('Erro' + error)
        }
    },

    //Handler para PUT
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

        const { nome, email, cmrv } = req.body;

        const trimmedEmail = email.trim();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json('Formato de email invalido.');
        }
        const allowedDomains = ['hotmail.com', 'gmail.com', 'outlook.com', 'yahoo.com'];

        const emailDomain = trimmedEmail.split('@')[1];

        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json('Dominio de email não permitido.');
        };

        if (!nome && !email && !cmrv) {
            res.status(400).send('Todos os campos devem ser preenchidos')
        }

        const vetAtualizar = new Veterinario(nome, email, cmrv);
        vetAtualizar.id = idToNumber;

        try {
            const putVet = await getRepoVeterinario().saveVet(vetAtualizar)
            if (putVet !== null) {
                return res.status(200).json('Veterinario atualizado com sucesso.');
            } else {
                return res.status(400).send('Erro ao atualizar, utilize um ID válido.');
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Erro interno')
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
            const delVet = await getRepoVeterinario().deleteVet(idToNumber)
            if (delVet.successo === true) {
                return res.status(200).send('Veterinario deletado com sucesso.');

            } else if (delVet.successo === false) {
                return res.status(400).send('Nenhum Veterinario encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum Veterinario encontrado com o ID')
        }
    }
}


export = veterinarioHandler;