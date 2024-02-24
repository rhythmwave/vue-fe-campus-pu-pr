import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentRequest {
    id: string
}
  

export interface DeleteStudentRoot {
    meta: MetaModel
    data: any
}
