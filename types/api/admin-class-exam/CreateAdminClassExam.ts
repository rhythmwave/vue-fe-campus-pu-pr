import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateAdminClassExamRequest {
    name: string
    age: number
}
  

export interface CreateAdminClassExamRoot {
    meta: MetaModel
    data: any
}

