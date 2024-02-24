import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateGraduationSessionRequest {
    id: string
    session_year: number
    session_number: number
    session_date: string
}
  

export interface UpdateGraduationSessionRoot {
    meta: MetaModel
    data: any
}
