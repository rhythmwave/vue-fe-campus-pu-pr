import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteGraduationRequest {
    id: string
}
  

export interface DeleteGraduationRoot {
    meta: MetaModel
    data: any
}
