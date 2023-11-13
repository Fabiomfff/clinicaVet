/* 
* Codigo relacionado a Autenticação
*
*/

// Dependencias
import jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
    interface Request {
        decoded?: any;
    }
}

const segredo = 'meuSegredo'

const authMid = {
    authenticate: (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers['x-token']

        //Ve se se req.header tem token
        if (!(token)) {
            //se nao, 403, msg de sem token
            return res.status(403).send('nenhum token');
        };

        //se tiver, ver se token é valido 
        jwt.verify(token as string, segredo, (err: jwt.VerifyErrors, decoded: any) => {
            if (err) {
                res.status(401).send('token invalido')
            } else {
                req.decoded = decoded
            }
        })
        next();
    }
}


// Export
export = authMid;