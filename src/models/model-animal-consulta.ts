import { Animal } from "./model-animal";
import { Consulta } from "./model-consulta";

export class AniCon {
    id: number;
    constructor(
        public consulta: Consulta,
        public animal: Animal
    ){}
}