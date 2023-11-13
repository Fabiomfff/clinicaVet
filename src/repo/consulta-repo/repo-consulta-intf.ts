
import { Consulta } from "../../models/model-consulta";

export interface IConsultaRepo {
    getConAll(): Promise<Consulta[]>;

    getCon(ACon: Consulta): Promise<Consulta>;

    saveCon(ACon: Consulta): Promise<Consulta>;

    deleteCon(AId: Number): Promise<{ successo: Boolean }>
}