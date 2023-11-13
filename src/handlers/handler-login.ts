/*
* handlers para Login
*
*/

// Dependencias
import { Request, Response } from 'express';
import express = require ('express');
import jwt from 'jsonwebtoken';
import { Login, login1 } from '../models/model-login';
import { getRepoLogin } from '../repo/login-repo/repo-login-factory';

const app = express();

export const loginHandler = {

    postHandler: async (req: Request, res: Response) => {
        const { login, senha } = req.body;

        if (!login && !senha) {
            return res.status(401).send('Dados inválidos.');
        }

        try {
            const novoLogin = new Login(login, senha);

            const authLogin = await getRepoLogin().Login(novoLogin);

            if (authLogin) {
                const segredo = 'meuSegredo';
                const token = jwt.sign({ login }, segredo);

                return res.send({ login, token });
            } else {
                return res.status(401).send('Login ou Senha invalido, tente novamente.');
            }
        } catch (error) {
            console.error(error);

            if (error.sqlMessage && error.sqlMessage.includes('You have an error in your SQL syntax')) {
                console.log('SQL syntax error:', error.sqlMessage);
                return res.status(400).send('Login ou Senha invalido, tente novamente.');
            }

            return res.status(500).send('Erro interno');
        }
    }
};




