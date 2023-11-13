/*
*   Interface relacionada a login
*
*/

import { Login } from "../../models/model-login";

export interface ILoginRepo {
    Login(ALog: Login): Promise<Login>;

}