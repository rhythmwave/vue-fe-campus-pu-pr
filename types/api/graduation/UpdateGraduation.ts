import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateGraduationRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateGraduationRoot {
    meta: MetaModel
    data: any
}
