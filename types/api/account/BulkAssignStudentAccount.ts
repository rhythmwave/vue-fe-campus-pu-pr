import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkAssignStudentAccountRoot {
    meta: MetaModel
    data: UserDataResponse[]
}

export interface UserDataResponse {
    user_id: string
    name: string
    username: string
    password: string
}

export interface BulkAssignStudentAccountRequest{
    authentication_type: string
    user_ids: string[]
}