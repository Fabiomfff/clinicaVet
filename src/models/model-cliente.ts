/*
*   Modelo para criação de Cliente
*
*/

//* Classe para exportar
export class Cliente {
    public id: number;
    constructor(
        public nome: string,
        public telefone: string,
        public email: string
    ) { }
}


