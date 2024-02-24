import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateAdminClassExamRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateAdminClassExamRoot {
    meta: MetaModel
    data: any
}
