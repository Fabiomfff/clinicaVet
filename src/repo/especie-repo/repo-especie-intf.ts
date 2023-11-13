
import { Especie } from "../../models/model-especie";

export interface IEspecieRepo {
    getEspAll(): Promise<Especie[]>;

    getEsp(AEsp: Especie): Promise<Especie>;

    saveEsp(AEsp: Especie): Promise<Especie>;

    deleteEsp(AId: Number): Promise<{ successo: Boolean }>
}