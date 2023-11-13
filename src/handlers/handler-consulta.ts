/*
* handlers para Consulta
*
*/

// Dependencias
import { Response, Request } from 'express';
import { getRepoConsulta } from '../repo/consulta-repo/repo-consulta-factory';
import { Consulta } from '../models/model-consulta';

// Handler para Consultas
const consultaHandler = {
    // Handler para GET 
    getHandler: async (req: Request, res: Response) => {

        try {
            const getAllConsulta = await getRepoConsulta().getConAll()
            res.status(200).send(getAllConsulta)
        } catch (error) {
            console.log(error)
            return res.status(500).send('Erro interno.')
        }
    },

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
            const getOneId = await getRepoConsulta().getCon({
                id: idParaNumero,
                data: '',
                diagnostico: '',
                remedio: '',
                veterinario: undefined,
                animal: undefined
            })
            if (getOneId) {
                console.log(getOneId);
                return res.status(200).send(getOneId);

            } else {
                return res.status(400).send('Não encontrado. Utilize um ID correto.');
            }
        } catch (error) {
            console.log('Erro lendo uma Consulta por ID', error);
            return res.status(500).send('Erro interno');
        }
    },

    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }

        const { diagnostico, remedio, veterinario, animal } = req.body;

        const medicamentosPermitidos = [
            "AMOXICILINA",
            "PREDNISONA",
            "IVERMECTINA",
            "RIMADYL (CARPROFENO)",
            "METRONIDAZOL",
            "CEFALOXINA",
            "CLAVAMOX (AMOXICILINA/CLAVULANATO)",
            "GABAPENTINA",
            "FUROSEMIDA",
            "ENROFLOXACINA",
            "CETIRIZINA",
            "TRAMADOL",
            "OMEPRAZOL",
            "FENOBARBITAL",
            "DIPIRONA"
        ];

        if (!medicamentosPermitidos.includes(remedio.toUpperCase())) {
            return res.status(400).send("Medicamento não permitido, os permitidos são : AMOXICILINA, PREDNISONA, IVERMECTINA, RIMADYL (CARPROFENO), METRONIDAZOL, CEFALOXINA, CLAVAMOX (AMOXICILINA/CLAVULANATO), GABAPENTINA, FUROSEMIDA, ENROFLOXACINA, CETIRIZINA, TRAMADOL, OMEPRAZOL, FENOBARBITAL, DIPIRONA");
        }
        if (!diagnostico && !remedio && !veterinario && !animal) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }
        try {
            const novaConsulta = new Consulta(diagnostico, remedio, veterinario, animal);

            const result = await getRepoConsulta().saveCon(novaConsulta);
            return res.status(200).json({ Consulta: novaConsulta });

        } catch (error) {
            console.error('Erro  criando Consulta:', error);
            res.status(400).send('erro')
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
        const { diagnostico, remedio, veterinario, animal } = req.body;

        const atualizaConsulta = new Consulta(diagnostico, remedio, veterinario, animal);
        atualizaConsulta.id = idToNumber;

        if (diagnostico && remedio && veterinario && animal) {
            try {
                const putConsulta = await getRepoConsulta().saveCon(atualizaConsulta);
                if (putConsulta !== null) {
                    console.log(putConsulta)
                    res.status(200).json({'Consulta atualizado com sucesso!': atualizaConsulta});
                } else {
                    res.status(400).send('Erro ao atualizar, utilize um ID válido.');
                }
            } catch (error) {
                console.log('erro ao atualizar Consulta:', error);
                return res.status(500).send('Erro interno: ' + error.message);
            }
        } else {
            res.status(400).send('Todos os campos devem ser preenchidos')
        }

    },


    // Handlers para DELETE
    deleteHandler: async (req: Request, res: Response) => {

        if (!req.params.id) {
            return res.status(400).send('Utilize um ID correto.')
        };

        const id = req.params.id
        const idToNumber = Number(id)
        if (isNaN(idToNumber)) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
        }

        try {
            const deleteConsulta = await getRepoConsulta().deleteCon(idToNumber)
            if (deleteConsulta.successo === true) {
                res.status(200).send('Consulta deletado com sucesso.');

            } else if (deleteConsulta.successo === false) {
                res.status(400).send('Nenhuma consulta encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum consulta encontrado com o ID')
        }
    }
}


export = consultaHandler