/*
*   Modelo para criação de Animal
*
*/

// * Dependencias
import { Cliente } from "./model-cliente"
import { Especie } from "./model-especie"
import { Usuario } from "./model-usuarios";

//* Classe para exportar
export class Animal {
    public id: number;
    public log_em: string
    constructor(
        public nome: string,
        public nasc: string,
        public usuario: Usuario,
        public dono: Cliente,
        public especie: Especie,
    ) { }
}

//programar - backend
// frontend - GERAR HTML - web (safari, firefox, chrome), android, ios, windows, linux
// <div >DADOX</div> javaSCRIPT - client side rendering
// server side rendering (ssr) - <div> OLÁ, FABIO </DIV>
// new Directory 
//CDK - AWS - infrastructure as code - cloudformation {minhabase: rds, port 3306}
//Terraform minhaabse:database