import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateGraduationRequest {
    name: string
    age: number
}
  

export interface CreateGraduationRoot {
    meta: MetaModel
    data: any
}

