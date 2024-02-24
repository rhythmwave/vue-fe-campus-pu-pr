import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateYudiciumSessionRequest {
    semester_id: string
    name: string
    session_date: string
}
  

export interface CreateYudiciumSessionRoot {
    meta: MetaModel
    data: any
}

