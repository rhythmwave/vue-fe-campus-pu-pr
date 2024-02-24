import { MetaModel } from "../meta"

export interface GetSsoAuthRequest {
}
export interface GetSsoAuthRoot {
    meta: MetaModel
    data: GetSsoAuthData
}

export interface GetSsoAuthData {
    url: string
    app_id: string
    frontend_url: string
}
