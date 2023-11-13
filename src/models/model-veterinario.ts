/*
*   Modelo para criação de Veterinario
*
*/

//* Classe para exportar
export class Veterinario {
    public id: number
    constructor(
        public nome: string,
        public email: string,
        public crmv: string
    ) { }
};


export const Vet1 = new Veterinario('bobo', 'bobo@gmail.com', '12314');
export const Vet2 = new Veterinario('bobo2', 'bobo22@gmail.com', '1227');