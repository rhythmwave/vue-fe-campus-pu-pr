import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateYudiciumSessionRequest {
    id: string
    semester_id: string
    name: string
    session_date: string
}


export interface UpdateYudiciumSessionRoot {
    meta: MetaModel
    data: any
}
