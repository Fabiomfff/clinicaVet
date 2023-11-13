
import { AniCon } from "../../models/model-animal-consulta";

export interface IAniConRepo {

    getAll(): Promise<AniCon[]>;

    getOne(AAnc: AniCon): Promise<AniCon>;

    saveOne(AAnc: AniCon): Promise<AniCon>;

    delete(AId: Number): Promise<{ successo: Boolean }>;

};