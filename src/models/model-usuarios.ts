/*
*   Modelo para criação de Usuario
*
*/

//* Classe para exportar
export class Usuario {
    public id: number
    constructor(
        public login: string,
        public senha: string
    ) { }
}
// No momento o que esta sendo usado se encontra em '../entities/entity-usuario.ts'