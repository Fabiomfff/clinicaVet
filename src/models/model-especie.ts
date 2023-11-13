/*
*   Modelo para criação de especie
*
*/

//* ENUM para o tipo de animal
export enum TipoEspecie  {
    CACHORRO ='CACHORRO',
    GATO = 'GATO'
};

//* Classe para exportar
export class Especie {
    public id: number;
    constructor(
        public tipo: TipoEspecie,
        public desc: string
         ) { }
};