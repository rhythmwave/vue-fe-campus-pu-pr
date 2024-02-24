import { MetaModel } from "../meta"

export interface LoginRequest {
    username: string
    password: string
}
export interface LoginRoot {
    meta: MetaModel
    data: LoginData
}
export interface LogoutRoot {
    meta: MetaModel
    data: any
}


export interface LoginData {
    access_token: string
    refresh_token: string
    app_type: string
    permission_names: string[]
    expiry_time: string
}
