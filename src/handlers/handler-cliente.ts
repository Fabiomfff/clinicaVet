/*
* handlers para Clientes
*
*/

import { Cliente } from '../models/model-cliente';
import {  CLI_LAST_ID_QUERY, ERR_REPOCLI_EMAIL_JA_EXITE } from '../repo/cliente-repo/repo-cliente-intf';
import  {getRepo} from '../repo/cliente-repo/repo-cliente-factory';
import { Response, Request } from 'express';
import { connection } from '../database/sql-connection';
import { ResultSetHeader } from 'mysql2';


// Handler para Cliente
export const clienteHandler = {
    // Handler para GET 
    getHandler: async (req: Request, res: Response) => {
        try {
            const getClientes = await getRepo().getCliAll();
            return res.json(getClientes);
        } catch (error) {
            console.error('Error', error);
            return res.status(500).send('Erro interno')
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
            
            const cliente = await getRepo().getCli({ id: idParaNumero, nome: '', email: '', telefone: '' })

            if (cliente) {
                return  res.status(200).json(cliente);
            } else {
                res.status(404).send('Cliente com esse ID não encontrado. Envie um ID válido.')
            }

        } catch (error) {
            console.log('Erro pegando cliente por ID', error);
            return res.status(500).send('Erro interno');
        }
    },


    // Handler para POST 
    postHandler: async (req: Request, res: Response) => {
       
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido');
        }

        const { nome, email, telefone } = req.body;

        if (!nome && !email && !telefone) {
            return res.status(400).send('Todos os campos devem ser preenchidos');
        }
        
        const trimmedEmail = email.trim();
        const trimmedTelefone = telefone.trim()

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json('Formato de email invalido.' );
        }

        const allowedDomains = ['hotmail.com', 'gmail.com', 'outlook.com', 'yahoo.com'];
        const emailDomain = trimmedEmail.split('@')[1]; // Extract the domain part of the email
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json('Dominio de email não permitido.');
        }

        const telefoneRegex = /^\(\d{2}\)\d{9}$/; // Allows any Brazilian DDD
        if (!telefoneRegex.test(trimmedTelefone)) {
            return res.status(400).json('Telefone invalido. Use: (DDD) 9 números.');
        }

       const novoCliente = new Cliente(nome, telefone, email);
               try {
                   await getRepo().saveCli(novoCliente);
                   const [lastInsertId] = await connection.promise().query<ResultSetHeader>(CLI_LAST_ID_QUERY)
                   return res.status(200).json({ cliente: novoCliente, lastInsertId });

        } catch (error) {
            if (Error(ERR_REPOCLI_EMAIL_JA_EXITE)) {
                console.error('Erro  criando Cliente:', error);
                return res.status(400).send('Email invalido, tente outro')
            }
            console.error('Erro  criando Cliente:', error);
             return res.status(500).send('Erro' + error)
        }
    },


    //Handler para PUT
    putHandler: async (req: Request, res: Response) => {
        
        if (!req.params.id) {
            return res.status(400).send('ID vazio')
        };

        let id: number = 0;
        try {
            id = Number(req.params.id)
             
        } catch (error) {
            return res.status(400).send('Falha ao converter ID para número. Envie um inteiro válido.')
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send('Nenhum dado recebido')
        };

        const { nome, email, telefone } = req.body;

        const trimmedEmail = email.trim();
        const trimmedTelefone = telefone.trim()
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json('Formato de email invalido.');
        }

        const telefoneRegex = /^\(\d{2}\)\d{9}$/; // Allows any Brazilian DDD
        if (!telefoneRegex.test(trimmedTelefone)) {
            return res.status(400).json('Telefone invalido. Use: (DDD) 9 números.');
        }

        const allowedDomains = ['hotmail.com', 'gmail.com', 'outlook.com', 'yahoo.com'];
        const emailDomain = trimmedEmail.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json('Dominio de email não permitido.');
        }

        const clienteAtualizar = new Cliente(nome, telefone, email);
        clienteAtualizar.id = id;

        if (nome && telefone && email) {
            try {
                const putCliente = await getRepo().saveCli(clienteAtualizar)

                if (putCliente !== null) {
                return res.status(200).json('Cliente atualizado com sucesso!');
                } else {
                 return res.status(400).send('Erro ao atualizar, utilize um ID válido.');
                }
                
            } catch (error) {
                if (Error(ERR_REPOCLI_EMAIL_JA_EXITE)) {
                    return res.status(400).send('Erro ao atualizar email')
                };
                console.log('erro putCliente:' + error);
                return res.status(500).send('Erro interno');
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
            const delCliente = await getRepo().deleteCli(idToNumber)
            if (delCliente.successo === true) {
            return res.status(200).send('Cliente deletado com sucesso.');

            } else if (delCliente.successo === false) {
            return res.status(400).send('Nenhum cliente encontrado com o ID')
            }
        } catch (error) {
            if (error.message == 'undefined')
                return res.status(500).send('Nenhum cliente encontrado com o ID')
        }
    }
};


