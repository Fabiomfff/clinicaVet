/*
*   Modelo para criação de especie
*
*/

import { EnumType } from "typescript"

//* Classe para exportar
export class Login {
    public id: number

    constructor(
        public login: string,
        public senha: string) { }
}   

export const login1 = new Login('fabmazu@gmail.com','minhasenha')