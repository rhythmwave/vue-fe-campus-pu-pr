import { MetaModel } from "../meta"

export interface LoginWithSsoRequest {
    username:string,
    sso_code:string,
}
export interface LoginWithSsoRoot {
    meta: MetaModel
    data: LoginWithSsoData
}

export interface LoginWithSsoData {
    access_token: string
    refresh_token: string
    app_type: string
    permission_names: string[]
    expiry_time: string
}
