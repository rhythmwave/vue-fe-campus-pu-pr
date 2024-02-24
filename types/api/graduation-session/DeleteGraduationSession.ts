import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteGraduationSessionRequest {
    id: string
}
  

export interface DeleteGraduationSessionRoot {
    meta: MetaModel
    data: any
}
