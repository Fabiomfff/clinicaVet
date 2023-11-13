
import { Animal } from "./model-animal"
import { Veterinario } from "./model-veterinario"

//* Classe para exportar
export class Consulta {
    public id: number
    public data: string
    constructor(
        public diagnostico: string,
        public remedio: string,
        public veterinario: Veterinario,
        public animal: Animal
    ) { }
};
