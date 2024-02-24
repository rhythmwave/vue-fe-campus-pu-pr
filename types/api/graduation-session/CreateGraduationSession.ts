import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateGraduationSessionRequest {
    session_year: number
    session_number: number
    session_date: string
}
  

export interface CreateGraduationSessionRoot {
    meta: MetaModel
    data: any
}

