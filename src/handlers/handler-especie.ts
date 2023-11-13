/*
* handlers para Especies
*
*/

import { Response, Request } from 'express';
import { getRepoEspecie } from '../repo/especie-repo/repo-especie-factory';
import { Especie, TipoEspecie} from '../models/model-especie';

// Handler para Especies
export const especieHandler = {


    // Handler para GET 
    getHandler: async (req: Request, res: Response) => {
        try {
            const getEsp = await getRepoEspecie().getEspAll()
            res.json(getEsp)

        } catch (error) {
            console.log('Error', error)
        }
    },

    getOneHandler: async (req: Request, res: Response) => {

        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };
        const id = Number(req.params.id)
        try {
            const idParaNumero = Number(id)
            if (isNaN(idParaNumero)) {
                return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.');
            }
            const especie = await getRepoEspecie().getEsp({
                id: idParaNumero,
                tipo: undefined ,
                desc: ''
            })
            
            if (especie) {
               return res.status(200).json(especie);
            } else {
                return  res.status(404).send('Especie com esse ID não encontrado. Envie um ID válido.')
            }
        } catch (error) {
            console.log('error', error)
        }
    },
        
    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {

        const { tipo, desc } = req.body;
        if (!tipo && !desc) {
            res.status(400).send('Erro, todos os campos devem ser preenchidos')
        }
        
        const tiposPermitidos = ["CACHORRO", "GATO"]
        const descCachorrosPermitidas = [
            'LABRADOR RETRIEVER',
            'BULDOGUE FRANCES',
            'GOLDEN RETRIEVER',
            'POODLE',
            'PASTOR ALEMÃO',
            'ROTTWEILER',
            'YORKSHIRE TERRIER',
            'BULLDOG INGLES',
        ];

        const descGatosPermitidas = [
            'SIAMES',
            'PERSA',
            'MAINE COON',
            'SPHYNX',
            'RAGDOLL',
            'BRITISH SHORTHAIR',
            'SCOTTISH FOLD',
        ];
        
        if (!tiposPermitidos.includes(tipo.toUpperCase())) {
            return res.status(400).send('Tipos permitidos são apenas CACHORRO ou GATO.')
        }

        if (tipo.toUpperCase() === 'CACHORRO') {
            if (!descCachorrosPermitidas.includes(desc.toUpperCase())) {
                return res.status(400).send(
                    ' A descrição de cachorros deve ser uma das seguintes raças: ' +
                    descCachorrosPermitidas.join(', ')
                );
            }
        };
        if (tipo.toUpperCase() === 'GATO') {
            if (!descGatosPermitidas.includes(desc.toUpperCase())) {
                return res.status(400).send(
                    ' A descrição de gatos deve ser uma das seguintes raças: ' + descGatosPermitidas.join(', ')
                );
            }
        }
        try {
            const novaEspecie = new Especie (tipo, desc)
            await getRepoEspecie().saveEsp(novaEspecie)
            res.status(200).json(novaEspecie)

        } catch (error) {
            console.log(error)
            res.status(500).send('Erro interno.')
        }
    },

    // Handler para PUT
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

        const { tipo, desc } = req.body

        if (!tipo && !desc) {
            res.status(400).send('Erro, todos os campos devem ser preenchidos')
        }
        const tiposPermitidos = ["CACHORRO", "GATO"]
        const descCachorrosPermitidas = [
            'LABRADOR RETRIEVER',
            'BULDOGUE FRANCES',
            'GOLDEN RETRIEVER',
            'POODLE',
            'PASTOR ALEMÃO',
            'ROTTWEILER',
            'YORKSHIRE TERRIER',
            'BULLDOG INGLES',
        ];

        const descGatosPermitidas = [
            'SIAMES',
            'PERSA',
            'MAINE COON',
            'SPHYNX',
            'RAGDOLL',
            'BRITISH SHORTHAIR',
            'SCOTTISH FOLD',
        ];

        if (!tiposPermitidos.includes(tipo.toUpperCase())) {
            return res.status(400).send('Tipos permitidos são apenas CACHORRO ou GATO.')
        }

        if (tipo.toUpperCase() === 'CACHORRO') {
            if (!descCachorrosPermitidas.includes(desc.toUpperCase())) {
                return res.status(400).send(
                    ' A descrição de cachorros deve ser uma das seguintes raças: ' +
                    descCachorrosPermitidas.join(', ')
                );
            }
        };
        if (tipo.toUpperCase() === 'GATO') {
            if (!descGatosPermitidas.includes(desc.toUpperCase())) {
                return res.status(400).send(
                    ' A descrição de gatos deve ser uma das seguintes raças: ' + descGatosPermitidas.join(', ')
                );
            }
        }
        const novaEspecie = new Especie(tipo, desc)
        novaEspecie.id = idToNumber
        try {

            const putEspecie = await getRepoEspecie().saveEsp(novaEspecie)

            if (putEspecie !== null) {
                res.status(200).json('Especie atualizada com sucesso.');
            } else {
                res.status(400).send('Erro ao atualizar, utilize um ID válido.');
            }

        } catch (error) {
            console.log(error)
            res.status(500).send('Erro interno')
        }
    },

    // Handler para DELETE
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
            const deleteEsp = await getRepoEspecie().deleteEsp(idToNumber)
            if (deleteEsp.successo === true) {
                res.status(200).send('Especie deletado com sucesso.');

            } else if (deleteEsp.successo === false) {
                res.status(400).send('Nenhum Especie encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum Especie encontrado com o ID')
        }
    }
}
