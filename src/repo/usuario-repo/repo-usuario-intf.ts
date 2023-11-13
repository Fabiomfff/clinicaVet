import { Usuario } from "../../models/model-usuarios";

export const ERR_REPOUSU_LOGIN_JA_EXITE: string = 'O login já está registrado.';

export interface IUsuarioRepo {
    getUsuAll(): Promise<Usuario[]>;

    getUsu(AUsu: Usuario): Promise<Usuario>;

    saveUsu(AUsu: Usuario): Promise<Usuario>;

    deleteUsu(AId: number): Promise<{ successo: Boolean }>
}